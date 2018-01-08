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
    }
  }
}
