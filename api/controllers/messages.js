/* eslint-disable camelcase */
'use strict'

module.exports = function(dependencies) {
  const {notifications, db} = dependencies
  const {Messages, Threads} = db

  return {
    getMessages: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const offset = req.swagger.params.pagination.value || 0
      const threadId = req.swagger.params.thread_id.value

      Threads.getThreadById(threadId)
      .then(t => t.dataValues.toUsername === username ?
          t.update({to_last_message_read_at: new Date()}) :
          t.update({from_last_message_read_at: new Date()}))
      .then(() => Messages.getThreadMessages(threadId, offset))
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
      .then(t => t.dataValues.toUsername === username ?
          t.update({to_last_message_at: new Date()}) :
          t.update({from_last_message_at: new Date()}))
      .then(t => {
        if (typeof t.dataValues !== undefined &&
          t.dataValues.status === 'REQUESTED' &&
          t.dataValues.toUsername === username)
          t.update({status: 'OPENED'})

        if (t.dataValues.status === 'REQUESTED' &&
          t.dataValues.fromUsername === username)
          return {}

        let message = `${username}: ${body.text}`

        if (body.products && body.products.length > 0)
          message = `${username} has shared product(s) with you.`
        else if (body.media && body.media.length > 0)
          message = `${username} has shared image(s) with you.`

        return notifications.send({
          username:
            t.dataValues.fromUsername === username ?
            t.dataValues.toUsername :
            t.dataValues.fromUsername,
          subject: message,
          url: `messages/${t.dataValues.id}`
        })
      })
      .then(() => Messages.createInstance(username, threadId, body.text))
      .then(msg => body.products ?
        Promise.all(
          body.products.map(m => msg.addProducts(m.id))).then(() => msg) :
        msg)
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
