'use strict'

module.exports = function(dependencies) {
  const {notifications, db} = dependencies
  const {Threads} = db

  return {
    getSelfThreads: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const offset = req.swagger.params.pagination.value || 0

      Threads.findUserThreads(username, offset, req.swagger.params.q.value)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    addMediaThread: function(req, res, next) {
      const threadId = req.swagger.params.thread_id.value
      const body = req.swagger.params.body.value

      Threads.getThreadById(threadId)
      .then(msg => body.media ?
        Promise.all(body.media.map(m => msg.addMedia(m.id))) : msg)
      .then(msg => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    createThread: function(req, res, next) {
      const fromUsername = req.headers['x-consumer-username']
      const toUsername = req.swagger.params.body.value.to.username

      Threads.createInstance(fromUsername, toUsername)
      .then(r =>
        r.isNotCreated ? r : notifications.send({
          username: toUsername,
          subject: `${fromUsername} sent you a message.`,
          url: `messages/${r.dataValues.id}`
        })
        .then(() => r))
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
          return t.update({status: 'CLOSED'})
        } else if (t.dataValues.toUsername === username) {
          return t.update({
            status: t.dataValues.status === 'CLOSED' ? 'CLOSED' : 'RATING',
            fromRating: body.rating,
            fromReview: body.review
          })
        } else if (t.dataValues.fromUsername === username) {
          return t.update({
            status: 'CLOSED',
            toRating: body.rating,
            toReview: body.review
          })
        }
        throw Object.assign(
          new Error('you cant close a thread that does not belong to you'),
          {statusCode: 401})
      })
      .then(r => {
        const d = r.dataValues
        switch (r.dataValues.status) {
          case 'CLOSED':
            return notifications.send({
              username: username === d.toUsername ?
                d.fromUsername : d.toUsername,
              subject: `${username} closed the advice request.`,
              url: `messages/${r.dataValues.id}`
            })
          case 'RATING':
            return notifications.send({
              username: username === d.toUsername ? d.fromUsername : username,
              subject: `${username} asked you for rating.`,
              url: `messages/${r.dataValues.id}`
            })
          default:
            return
        }
      })
      .then(() => {
        res.json({success: true, id: threadId})
        return next()
      })
      .catch(e => next(e))
    }
  }
}
