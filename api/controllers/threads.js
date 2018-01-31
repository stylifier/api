'use strict'

module.exports = function(dependencies) {
  const Threads = dependencies.db.Threads
  const Subscriptions = dependencies.db.Subscriptions
  const oneSignal = dependencies.oneSignal

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
    createThread: function(req, res, next) {
      const fromUsername = req.headers['x-consumer-username']
      const toUsername = req.swagger.params.body.value.to.username

      Threads.createInstance(fromUsername, toUsername)
      .then(r =>
        r.isNotCreated ? r : Subscriptions.getUsersSubscriptions(toUsername)
        .then(ids =>
          oneSignal.send(ids,
            `${fromUsername} asked for your advice.`,
            `messages/${r.dataValues.id}`))
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
            return Subscriptions.getUsersSubscriptions(
              username === d.toUsername ? d.fromUsername : username)
            .then(ids =>
              oneSignal.send(ids,
                `${username} closed the advice request.`,
                `messages/${r.dataValues.id}`))
          case 'RATING':
            return Subscriptions.getUsersSubscriptions(
              username === d.toUsername ? d.fromUsername : username)
            .then(ids =>
              oneSignal.send(ids,
                `${username} asked for your rating on his advice.`,
                `messages/${r.dataValues.id}`))
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
