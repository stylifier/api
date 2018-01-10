'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('followable', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.createInstance = function(follower, followedBy) {
    return this.create({
      id: id(),
      followerUsername: follower,
      followedByUsername: followedBy
    })
  }

  model.getUserFollowers = function(username, offset) {
    return this.findAll({
      where: {followerUsername: username},
      attributes: [],
      include: [{
        model: sequelize.models.Users,
        as: 'followed_by',
        attributes: sequelize.models.shortAttributes
      }],
      offset: offset,
      limit: 20
    })
  }

  return model
}
