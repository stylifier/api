'use strict'

module.exports = function(dependencies) {
  const Messages = dependencies.db.Messages

  return {
    getMessages: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const threadId = req.swagger.params.thread_id.value

      Messages.getThreadMessages(threadId, offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    createMessage: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const body = req.swagger.params.body.value
      const threadId = req.swagger.params.thread_id.value

      Messages.createInstance(username, threadId, body.text)
      .then(msg => msg.addMedia(body.media))
      .then(msg => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    }
  }
}
