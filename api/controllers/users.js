'use strict'

module.exports = function(dependencies) {
  const Users = dependencies.db.Users
  const Op = dependencies.db.Op
  const id = dependencies.id
  const bcrypt = dependencies.bcrypt
  const kong = dependencies.kong
  
  return {
    registerUser: function(req, res, next) {
      const userToCreate = Object.assign({
        id: id(), 
        is_brand: false, 
        is_instagram_user: false,
        contribution_earned: 0
      }, req.swagger.params.userInfo.value)
      userToCreate.password = bcrypt.hashSync(userToCreate.password, 10);
      Users.create(userToCreate)
      .then(r => kong.createUser(r.username, r.id))
      .then(r => kong.createJWT(r.username, r.id))
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    login: function(req, res, next) {
      const userToLogin = Object.assign({}, req.swagger.params.loginInfo.value)
      
      Users.findOne({where: {username: userToLogin.username}})
      .then(user => user.get('password'))
      .then(password => bcrypt.compare(userToLogin.password, password))
      .then(r => kong.createJWT(userToLogin.username))
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getBrands: function(req, res, next) {
      const quary = req.swagger.params.q.value
      const offset = req.swagger.params.pagination.value || 0
      
      Users.findAll({
        where: {[Op.and]: [
          {[Op.or]: [
            {username: {[Op.like]: `%${quary}%`}},
            {full_name: {[Op.like]: `%${quary}%`}}
          ]},
          {is_brand: true}
        ]},
        offset: offset, 
        limit: 20,
        attributes: ['username', 'id', 'full_name', 'profile_picture', ['createdAt', 'created_time']]
      })
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getUsers: function(req, res, next) {
      const quary = req.swagger.params.q.value
      const offset = req.swagger.params.pagination.value || 0
      
      Users.findAll({
        where: {[Op.and]: [
          {[Op.or]: [
            {username: {[Op.like]: `%${quary}%`}},
            {full_name: {[Op.like]: `%${quary}%`}}
          ]},
          {is_brand: false}
        ]},
        offset: offset, 
        limit: 20,
        attributes: ['username', 'id', 'full_name', 'profile_picture', ['createdAt', 'created_time']]
      })
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getUserByUsername: function(req, res, next) {
      const username = req.swagger.params.username.value
      
      Users.findOne({where: {username: username}})
      .then(i => ({
        id: i.id,
        username: i.username, 
        full_name: i.full_name,
        profile_picture: i.profile_picture
      }))
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getSelfUser: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      
      Users.findOne({
        where: {username: username},
        attributes: ['username', 'id', 'full_name', 'profile_picture', ['createdAt', 'created_time']]
      })
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    }
  }
}
