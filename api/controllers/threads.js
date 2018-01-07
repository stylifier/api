'use strict'

module.exports = function(dependencies) {
  const Threads = dependencies.db.Threads
  const Users = dependencies.db.Users
  const Op = dependencies.db.Op
  const id = dependencies.id
  const kong = dependencies.kong
  
  return {
    getSelfThreads: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const offset = req.swagger.params.pagination.value || 0
      
      Threads.findAll({
        where: {
          [Op.or]: [
            {fromUsername: username},
            {toUsername: username}
          ]
        },
        offset: offset, 
        limit: 20,
        attributes: ['id', 'status', ['createdAt', 'created_time']],
        include: [
          {
            model: Users,
            as: 'from',
            attributes: ['username', 'id', 'full_name', 'profile_picture', ['createdAt', 'created_time']]
          },
          {
            model: Users,
            as: 'to',
            attributes: ['username', 'id', 'full_name', 'profile_picture', ['createdAt', 'created_time']]
          }
        ]
      })
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    createThread: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      
      Threads.create({
        id: id(), 
        status: 'REQUESTED',
        fromUsername: username, 
        toUsername: req.swagger.params.body.value.to.username,
      })
      .then(r => {
        res.json({success: true, id: r.dataValues.id})
        next()
      })
      .catch(e => next(e))
    }
  }
}