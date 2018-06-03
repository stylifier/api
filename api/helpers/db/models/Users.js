/* eslint-disable camelcase */
'use strict'

const id = require('uniqid')
const bcrypt = require('bcrypt')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('users', {
    username: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    full_name: Datatypes.STRING,
    password: Datatypes.STRING,
    banner: Datatypes.STRING,
    profile_picture: Datatypes.STRING,
    id: Datatypes.STRING,
    website: Datatypes.STRING,
    email: Datatypes.STRING,
    bio: Datatypes.TEXT,
    contribution_earned: Datatypes.DOUBLE,
    rating: Datatypes.DOUBLE,
    is_instagram_user: Datatypes.BOOLEAN,
    is_brand: Datatypes.BOOLEAN,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.createInstance = function(obj, isBrand) {
    const userId = id()
    const userToCreate = Object.assign({
      id: userId,
      is_instagram_user: false,
      is_brand: typeof isBrand === undefined ? false : isBrand,
      username: obj.username.toLowerCase(),
      full_name: obj.full_name.toLowerCase(),
      contribution_earned: 0,
      profile_picture: `https://identicon-api.herokuapp.com/${userId}/300?format=png`
    }, obj)
    userToCreate.password = bcrypt.hashSync(userToCreate.password, 10)
    return this.create(userToCreate)
    .catch(e => Promise.reject(Object.assign(
        new Error('Username is taken, please try another username'),
        {statusCode: 403})))
  }

  model.findOrCreateInstance = function(obj, isInstagramUser, isPinterestUser) {
    return this.findOrCreate({
      where: {id: obj.id},
      defaults: {
        id: obj.id,
        full_name: obj.full_name ? obj.full_name.toLowerCase() : '',
        profile_picture: obj.profile_picture ? obj.profile_picture : '',
        bio: obj.bio,
        website: obj.website ? obj.website.toLowerCase() : '',
        username: obj.username.toLowerCase(),
        is_brand: false,
        is_instagram_user: isInstagramUser,
        is_pinterest_user: isPinterestUser,
        contribution_earned: 0,
      }
    })
  }

  model.findByQuary = function(q, offset, isBrand) {
    return this.findAll({
      where: {[Datatypes.Op.and]: [
        {[Datatypes.Op.or]: [
          {username: {[Datatypes.Op.like]: `%${q.toLowerCase()}%`}},
          {full_name: {[Datatypes.Op.like]: `%${q.toLowerCase()}%`}}
        ]},
        {is_brand: isBrand}
      ]},
      offset: offset,
      limit: 20,
      attributes: this.shortAttributes
    })
    .then(res =>
      Promise.all(res.map(user =>
        sequelize.models.threads.getUserRating(user.username)
        .then(({count, rating}) =>
          Object.assign(user, {rating: rating, responded_request_count: count}))
      ))
    )
  }

  model.checkLogin = function(username, password) {
    return this.findOne({where: {username: username.toLowerCase()}})
    .then(user => user.get('password'))
    .then(psw => bcrypt.compareSync(password, psw) ?
      Promise.resolve() :
      Promise.reject('wrong username or password')
    )
  }

  model.shortAttributes = [
    'username',
    'id',
    'full_name',
    'profile_picture',
    ['createdAt', 'created_time']
  ]

  model.fullAttributes = [
    'bio',
    'contribution_earned',
    'rating',
    'is_instagram_user',
    'is_pinterest_user',
    'is_brand',
    'email',
    ...model.shortAttributes
  ]

  model.findUsername = function(username, isFullAttributes) {
    return this.findOne({
      where: {username: username.toLowerCase()},
      attributes: isFullAttributes ? this.fullAttributes : this.shortAttributes
    })
    .then(res =>
      sequelize.models.threads.getUserRating(username)
      .then(({count, rating}) =>
        Object.assign({}, res ? res.dataValues : {}, {
          rating: rating,
          responded_request_count: count
        }))
    )
    .then(res =>
      sequelize.models.threads.getUserRequestRating(username)
      .then(rating => Object.assign({}, res, {request_rating: rating}))
    )
  }

  model.findUserByUsername = function(username, isFullAttributes) {
    return this.findOne({
      where: {username: username.toLowerCase()},
      attributes: isFullAttributes ? this.fullAttributes : this.shortAttributes
    })
  }

  return model
}
