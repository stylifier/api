'use strict'

module.exports = function(dependencies) {
  const Messages = dependencies.db.Messages
  const Threads = dependencies.db.Threads
  const Subscriptions = dependencies.db.Subscriptions
  const oneSignal = dependencies.oneSignal

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

      Threads.getThreadById(threadId)
      .then(t => {
        if (typeof t.dataValues === undefined ||
          t.dataValues.status !== 'REQUESTED' ||
          t.dataValues.toUsername !== username)
          return t

        t.update({status: 'OPENED'})

        return Subscriptions.getUsersSubscriptions(t.dataValues.fromUsername)
        .then(ids =>
          oneSignal.send(ids,
            `${username} accepted your advice request.`,
            `messages/${t.dataValues.id}`))
      })
      .then(() => Messages.createInstance(username, threadId, body.text))
      .then(msg => body.media ?
        Promise.all(body.media.map(m => msg.addMedia(m.id))) : msg)
      .then(msg => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    }
  }
}
