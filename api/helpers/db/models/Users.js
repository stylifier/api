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
      attributes: [
        'username',
        'id',
        'full_name',
        'profile_picture',
        ['createdAt', 'created_time']
      ]
    })
  }

  model.findUsername = function(username) {
    return this.findOne({
      where: {username: username},
      attributes: [
        'username',
        'id',
        'full_name',
        'profile_picture',
        ['createdAt', 'created_time']
      ]
    })
  }

  return model
}
