'use strict'

module.exports = function(dependencies) {
  const Users = dependencies.db.Users
  const bcrypt = dependencies.bcrypt
  const kong = dependencies.kong

  return {
    registerUser: function(req, res, next) {
      Users.createInstance(req.swagger.params.userInfo.value)
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
      const offset = req.swagger.params.pagination.value || 0
      Users.findByQuary(req.swagger.params.q.value, offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getUsers: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      Users.findByQuary(req.swagger.params.q.value, offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getUserByUsername: function(req, res, next) {
      const username = req.swagger.params.username.value
      Users.findUsername(username)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getSelfUser: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      Users.findUsername(username)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    }
  }
}
