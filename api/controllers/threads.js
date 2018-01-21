'use strict'

module.exports = function(dependencies) {
  const Threads = dependencies.db.Threads

  return {
    getSelfThreads: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const offset = req.swagger.params.pagination.value || 0

      Threads.findUserThreads(username, offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    createThread: function(req, res, next) {
      const fromUsername = req.headers['x-consumer-username']
      const toUsername = req.swagger.params.body.value.to.username

      Threads.createInstance(fromUsername, toUsername)
      .then(r => {
        res.json({success: true, id: r.dataValues.id})
        next()
      })
      .catch(e => next(e))
    },
    closeThread: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const body = req.swagger.params.body.value
      const threadId = req.swagger.params.thread_id.value

      Threads.getThreadById(threadId)
      .then(t => {
        if (t.dataValues.status === 'REQUESTED') {
          t.update({
            status: 'CLOSED'
          })
          res.json({success: true, id: threadId})
          return next()
        } else if (t.dataValues.toUsername === username) {
          t.update({
            status: t.dataValues.status === 'CLOSED' ? 'CLOSED' : 'RATING',
            fromRating: body.rating,
            fromReview: body.review
          })
          res.json({success: true, id: threadId})
          return next()
        } else if (t.dataValues.fromUsername === username) {
          t.update({
            status: 'CLOSED',
            toRating: body.rating,
            toReview: body.review
          })
          res.json({success: true, id: threadId})
          return next()
        }
        next(Object.assign(
          new Error('you cant close a thread that does not belong to you'),
          {statusCode: 401})
        )
      })
    }
  }
}
