'use strict'

module.exports = function(dependencies) {
  const Users = dependencies.db.Users
  const Media = dependencies.db.Media
  const kong = dependencies.kong
  const instagram = dependencies.instagram

  const register = (req, res, next) =>
    Users.createInstance(req.swagger.params.userInfo.value)
    .then(r => kong.createUser(r.username, r.id))
    .then(r => kong.createJWT(r.username, r.id))
    .then(r => {
      res.json(r)
      next()
    })
    .catch(e => next(e))

  const registerWithInstagram = (req, res, next) =>
    instagram.getToken(req.swagger.params.userInfo.value.instagram_code)
    .then(instRes => {
      console.log(JSON.stringify(instRes, 0, 2))
      Users.findOrCreateInstance(instRes.user)
      .spread((user, isCreated) =>
        kong.createUser(user.username, user.id).then(() =>
        Promise.resolve(user, isCreated))
      )
      .then((user, isCreated) => {
        return instagram.getRecentMedia(instRes.access_token)
        .then(media => ({username: user.username, media}))
      })
      .then(({username, media}) =>
        Media.createOrUpdateInstances(media, username)
        .then(() => ({username, media})))
      .then(({username, media}) => kong.createJWT(username))
      .then(r => {
        res.json(r)
        next()
      })
    })
    // Users.createInstance(req.swagger.params.userInfo.value)
    // .then(r => kong.createUser(r.username, r.id))
    // .then(r => kong.createJWT(r.username, r.id))
    // .then(r => {
    //   res.json(r)
    //   next()
    // })
    .catch(e => next(e))

  return {
    registerUser: function(req, res, next) {
      return req.swagger.params.userInfo.value.instagram_code ?
        registerWithInstagram(req, res, next) :
        register(req, res, next)
    },
    login: function(req, res, next) {
      const userToLogin = Object.assign({}, req.swagger.params.loginInfo.value)
      Users.checkLogin(userToLogin.username, userToLogin.password)
      .then(r => kong.createJWT(userToLogin.username))
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e =>
        next(Object.assign(
          new Error('wrong username or password'),
          {statusCode: 401})
        ))
    },
    getBrands: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      Users.findByQuary(req.swagger.params.q.value, offset, false)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getUsers: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      Users.findByQuary(req.swagger.params.q.value, offset, true)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getUserByUsername: function(req, res, next) {
      const username = req.swagger.params.username.value
      Users.findUsername(username, true)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getSelfUser: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      Users.findUsername(username, true)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    }
  }
}
