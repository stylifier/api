/* eslint-disable camelcase */
'use strict'

module.exports = function(dependencies) {
  const {kong, instagram, pinterest, db} = dependencies
  const {Users, Media, Invites} = db

  const register = (req, res, next) => {
    let inviteInstance
    const userInfo = req.swagger.params.userInfo.value
    return new Promise((accept, reject) => {
      if (userInfo.invite_code &&
         userInfo.invite_code.startsWith('M_G_I_O_S') &&
         userInfo.username.startsWith('M_G_I_O_S'))
        return accept({is_brand: false, update: () => {}})
      return Invites.useInviteCode(userInfo.invite_code)
    })
    .then(invite => {
      inviteInstance = invite
      return Users.createInstance(userInfo, invite.is_brand)
    })
    .then(r =>
      kong.createUser(r.username, r.id)
      .then(() => r))
    .then(r => kong.createJWT(r.username))
    .then(r => {
      if (inviteInstance) inviteInstance.update({is_used: true})
      res.json(r)
      next()
    })
    .catch(e => next(e))
  }

  const registerWithInstagram = (req, res, next) =>
    instagram.getToken(req.swagger.params.userInfo.value.instagram_code)
    .then(instRes => {
      Users.findOrCreateInstance(instRes.user, true, false)
      .spread((user, isCreated) =>
        isCreated ?
          Invites.useInviteCode(req.swagger.params.userInfo.value.invite_code)
          .then(invite => {
            user.update({is_brand: invite.is_brand})
            invite.update({is_used: true})
            return Promise.resolve(user, isCreated)
          })
          .catch(e => {
            if (user) user.destroy()
            return Promise.reject(e)
          }) :
          Promise.resolve(user, isCreated)
      )
      .then((user, isCreated) => {
        return kong.createUser(user.username, user.id)
        .then(() => user.update({
          profile_picture: instRes.user.profile_picture,
          full_name: instRes.user.full_name.toLowerCase(),
          bio: instRes.user.bio,
          website: instRes.user.website ?
            instRes.user.website.toLowerCase() : '',
          username: instRes.user.username.toLowerCase(),
          is_brand: instRes.user.is_business,
          is_instagram_user: true,
        }))
        .then(() => Promise.resolve(user, isCreated))
      })
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
      .catch(e => next(e))
    })
    .catch(e => next(e))

  const registerWithPinterest = (req, res, next) =>
    pinterest.getToken(req.swagger.params.userInfo.value.pinterest_code)
    .then(pinterestUser => {
      Users.findOrCreateInstance(pinterestUser, false, true)
      .spread((user, isCreated) =>
        isCreated ?
          Invites.useInviteCode(req.swagger.params.userInfo.value.invite_code)
          .then(invite => {
            user.update({is_brand: invite.is_brand})
            invite.update({is_used: true})
            return Promise.resolve(user, isCreated)
          })
          .catch(e => {
            if (user) user.destroy()
            return Promise.reject(e)
          }) :
          Promise.resolve(user, isCreated)
      )
      .then((user, isCreated) => {
        return kong.createUser(user.username, user.id)
        .then(() => user.update({
          profile_picture:
           pinterestUser.image[Object.keys(pinterestUser.image)[0]].url,
          full_name:
            pinterestUser.first_name.toLowerCase() +
            pinterestUser.last_name.toLowerCase(),
          bio: pinterestUser.bio,
          website: pinterestUser.url,
          username: pinterestUser.username,
          is_pinterest_user: true
        }))
        .then(() => Promise.resolve(user, isCreated))
      })
      .then((user, isCreated) => {
        return pinterest.getMedia(pinterestUser.access_token)
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
      .catch(e => next(e))
    })
    .catch(e => next(e))

  return {
    registerUser: function(req, res, next) {
      if (req.swagger.params.userInfo.value.instagram_code)
        return registerWithInstagram(req, res, next)
      else if (req.swagger.params.userInfo.value.pinterest_code)
        return registerWithPinterest(req, res, next)

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
      .catch(e => {
        console.log(e)
        return next(Object.assign(
          new Error('wrong username or password'),
          {statusCode: 401}))
      })
    },
    getBrands: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      Users.findByQuary(req.swagger.params.q.value, offset, true)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getUsers: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      Users.findByQuary(req.swagger.params.q.value, offset, false)
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
    },
    setProfilePicture: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const media = req.swagger.params.media.value
      Users.findUserByUsername(username, true)
      .then(r => r.update({
        profile_picture: media.images.standard_resolution.url}))
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    }
  }
}
