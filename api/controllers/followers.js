'use strict'

module.exports = function(dependencies) {
  const {notifications, db} = dependencies
  const {Followable} = db

  return {
    createFollow: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const usernameToFollow = req.swagger.params.username.value

      Followable.createInstance(username, usernameToFollow)
      .then(r =>
        notifications.send({
          username: usernameToFollow,
          subject: `${username.replace('m_g_i_o_s_', '')} started following you.`,
          url: `profile/${username}`
        })
        .then(() => r))
      .then(userToFollow => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getUsersFollowers: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.swagger.params.username.value
      const query = req.swagger.params.q.value

      Followable.getUserFollowers(username, offset, query)
      .then(r => r.map(i => i.followed_by))
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    }
  }
}
