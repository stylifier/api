'use strict'

module.exports = function(dependencies) {
  const s3 = dependencies.s3
  const id = dependencies.id
  const Media = dependencies.db.Media
  const Op = dependencies.db.Op
  const Users = dependencies.db.Users
  const bucket = 'stylifier.com-images'
  
  const getMediaByUserName = (usernames, offset) => 
    Media.findAll({
      where: {userUsername: {[Op.in]: usernames}},
      offset: offset,
      limit: 20,
      attributes: ['id', 'images', 'type', 'is_user_liked', 'location', ['createdAt', 'created_time']],
      order: [['updatedAt', 'DESC']],
      include: [{
        model: Users,
        as: 'user',
        attributes: ['username', 'id', 'full_name', 'profile_picture', ['createdAt', 'created_time']]
      }]
    })
  
  return {
    createMedia: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const mediaId = id()
      const mediaExtention = req.file.mimetype.split('/')[1]
      
      s3.putObject({
        Bucket: bucket,
        Key: mediaId + '.' + mediaExtention, 
        Body: req.file.buffer,
        ACL: 'public-read', // your permisions  
      }, (err, o) => {
        if(err)
          return next(err)
        
        Media.create({
          id: mediaId,
          userUsername: username,
          images: {
            thumbnail: {
              url: `https://s3.eu-central-1.amazonaws.com/${bucket}/${mediaId}.${mediaExtention}`
            },
            low_resolution: {
              url: `https://s3.eu-central-1.amazonaws.com/${bucket}/${mediaId}.${mediaExtention}`
            },
            standard_resolution: {
              url: `https://s3.eu-central-1.amazonaws.com/${bucket}/${mediaId}.${mediaExtention}`
            }
          },
          type: 'image'
        })
        .then(media => {
          res.json(media)
          next()
        })
        .catch(e => next(e))
      })
    },
    getUserMedia: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.swagger.params.username.value
      
      getMediaByUserName([username], offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getSelfMedia: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']
      
      getMediaByUserName([username], offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getFeeds: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']
      
      Followable.findAll({
        where: {followerUsername: username},
        attributes: [],
        include: [{
          model: Users,
          as: 'followed_by',
          attributes: ['username', 'id', 'full_name', 'profile_picture', ['createdAt', 'created_time']]
        }],
        offset: offset, 
        limit: 20
      })
      .then(r => r.map(i => i.followed_by))
      .then(r => getMediaByUserName(r, offset))
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
    }
  }
}