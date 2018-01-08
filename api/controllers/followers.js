'use strict'

module.exports = function(dependencies) {
  const Followable = dependencies.db.Followable

  return {
    createFollow: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const usernameToFollow = req.swagger.params.username.value

      Followable.createInstance(username, usernameToFollow)
      .then(userToFollow => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getUsersFollowers: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']

      Followable.getUserFollowers(username, offset)
      .then(r => r.map(i => i.followed_by))
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    }
  }
}
