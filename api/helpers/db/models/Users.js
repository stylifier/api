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
    profile_picture: Datatypes.STRING,
    id: Datatypes.STRING,
    website: Datatypes.STRING,
    bio: Datatypes.TEXT,
    contribution_earned: Datatypes.DOUBLE,
    rating: Datatypes.DOUBLE,
    is_instagram_user: Datatypes.BOOLEAN,
    is_brand: Datatypes.BOOLEAN,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.createInstance = function(obj) {
    const userId = id()
    const userToCreate = Object.assign({
      id: userId,
      is_brand: false,
      is_instagram_user: false,
      contribution_earned: 0,
      profile_picture: `https://identicon-api.herokuapp.com/${userId}/300?format=png`
    }, obj)
    userToCreate.password = bcrypt.hashSync(userToCreate.password, 10)
    return this.create(userToCreate)
  }

  model.findOrCreateInstance = function(obj) {
    return this.findOrCreate({
      where: {id: obj.id},
      defaults: {
        id: obj.id,
        full_name: obj.full_name,
        profile_picture: obj.profile_picture,
        bio: obj.bio,
        website: obj.website,
        username: obj.username,
        is_brand: obj.is_business,
        is_instagram_user: true,
        contribution_earned: 0,
      }
    })
  }

  model.findByQuary = function(q, offset) {
    return this.findAll({
      where: {[Datatypes.Op.and]: [
        {[Datatypes.Op.or]: [
          {username: {[Datatypes.Op.like]: `%${q}%`}},
          {full_name: {[Datatypes.Op.like]: `%${q}%`}}
        ]},
        {is_brand: true}
      ]},
      offset: offset,
      limit: 20,
      attributes: this.shortAttributes
    })
  }

  model.checkLogin = function(username, password) {
    return this.findOne({where: {username: username}})
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
    'is_brand',
    ...model.shortAttributes
  ]

  model.findUsername = function(username, isFullAttributes) {
    return this.findOne({
      where: {username: username},
      attributes: isFullAttributes ? this.fullAttributes : this.shortAttributes
    })
  }

  return model
}
