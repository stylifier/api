/* eslint-disable camelcase */
'use strict'

module.exports = function(dependencies) {
  const {
    kong,
    location,
    instagram,
    pinterest,
    db,
    notifications,
    mailer} = dependencies
  const {Users, Media, Invites, Threads} = db

  const register = (req, res, next) => {
    let inviteInstance
    const userInfo = req.swagger.params.userInfo.value

    if (userInfo.username.length < 45) {
      userInfo.username = userInfo.username.replace('m_g_i_o_s_', '')
    }
    let pr

    if (userInfo.invite_code && userInfo.invite_code.startsWith('m_g_i_o_s')) {
      pr = new Promise((accept, reject) => {
        return accept({is_brand: false, is_guest: true, update: () => {}})
      })
    } else {
      pr = Invites.useInviteCode(userInfo.invite_code)
    }

    pr.then(invite => {
      inviteInstance = invite
      return Users.createInstance(userInfo,
        invite.is_brand,
        invite.is_guest === true)
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
      .then(u => kong.createJWT(u))
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => {
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
      const remoteIps = (req.headers['x-forwarded-for'] || '')
        .split(',').filter(a => a && a.length > 4).map(a => a.trim())

      Users.findUserByUsername(username, true)
      .then(r => remoteIps.length > 0 ?
        location.getCountryCode(remoteIps[0])
          .then(cc => r.update({
            country_code: cc,
            is_guest: r.is_guest && cc !== 'DE'
          })) : r)
      .then(res =>
        Threads.getUserRating(username)
        .then(({count, rating}) =>
          Object.assign({}, res ? res.dataValues : {}, {
            rating: rating,
            responded_request_count: count
          }))
      )
      .then(res =>
        Threads.getUserRequestRating(username)
        .then(rating => Object.assign({}, res, {
          request_rating: rating,
          is_guest: false, // SHOULD BE EVENTUALLY REMOVED
        }))
      )
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
    },
    approveUser: function(req, res, next) {
      const username = req.headers['x-consumer-username']

      if (username !== 'ali')
        return next(Object.assign(
          new Error('only accessible by admin'),
          {statusCode: 401}))

      const usernameToApprove = req.swagger.params.username.value

      Users.findUserByUsername(usernameToApprove, true)
      .then(r => r.update({is_guest: false}))
      .then(user =>
        notifications.send({
          username: usernameToApprove,
          subject: 'Creating Outfit on Stylifier ' +
            'is now available on your region',
          url: '#',
          body: mailer.templates.createApproveUserBody(usernameToApprove)
        }))
      .then(() => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    requestApproveUser: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const body = req.swagger.params.body.value

      Users.findUserByUsername(username, true)
      .then(m => notifications.emailAdmin({
        subject: `${username.replace('m_g_i_o_s_', '')} wants to be approved for beta testing`,
        body: `
<br><br>
You can approve the request in following link:
<br><br>
<a href="__SWB__/approve_user?username=${username}"> Approve ${username.replace('m_g_i_o_s_', '')} </a>
<br><br>
More info:<br>
${Object.keys(body).map(k => `${k}: ${JSON.stringify(body[k], null, 2)}<br>`)}`
      }))
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    }
  }
}
