'use strict'

module.exports = function(dependencies) {
  const s3 = dependencies.s3
  const id = dependencies.id
  const Media = dependencies.db.Media
  const Followable = dependencies.db.Followable
  const bucket = 'stylifier.com-images'

  return {
    createMedia: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const mediaId = id()
      const mediaExtention = req.file.mimetype.split('/').pop()
      const isPublic = req.headers['x-is-public'] === 'true'

      s3.putObject({
        Bucket: bucket,
        Key: mediaId + '.' + mediaExtention,
        Body: req.file.buffer,
        ACL: 'public-read', // your permisions
      }, (err, o) => {
        if (err) {
          return next(err)
        }

        Media.createInstance(username, mediaExtention, bucket, mediaId, isPublic)
        .then(media => {
          res.json({success: true, id: media.id})
          next()
        })
        .catch(e => next(e))
      })
    },
    getUserMedia: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.swagger.params.username.value

      Media.getMediaByUsernames([username], offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getSelfMedia: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']

      Media.getMediaByUsernames([username], offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getFeeds: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']

      Followable.getUserFollowers(username, 0, undefined, 10000)
      .then(r => r.map(i => i.followed_by.username))
      .then(r => Media.getMediaByUsernames(r, offset))
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
    }
  }
}
