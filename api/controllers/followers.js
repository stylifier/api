'use strict'

module.exports = function(dependencies) {
  const Users = dependencies.db.Users
  const Followable = dependencies.db.Followable
  const Op = dependencies.db.Op
  const id = dependencies.id
  
  return {
    createFollow: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const usernameToFollow = req.swagger.params.username.value
      
      Followable.create({
        id: id(), 
        followerUsername: username, 
        followedByUsername: usernameToFollow
      })
      .then(userToFollow => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getUsersFollowers: function(req, res, next) {
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
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    }
  }
}