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
        attributes: [
          'username',
          'id',
          'full_name',
          'profile_picture',
          ['createdAt', 'created_time']
        ]
      }],
      offset: offset,
      limit: 20
    })
  }

  return model
}
