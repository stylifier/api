/* eslint-disable camelcase */
'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('media', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    images: Datatypes.JSON,
    type: Datatypes.STRING,
    is_user_liked: Datatypes.BOOLEAN,
    location: Datatypes.JSON,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.getMediaByUsernames = function(usernames, offset) {
    return this.findAll({
      where: {userUsername: {[Datatypes.Op.in]: usernames}},
      offset: offset,
      limit: 20,
      attributes: [
        'id',
        'images',
        'type',
        'is_user_liked',
        'location',
        ['createdAt', 'created_time']
      ],
      order: [['updatedAt', 'DESC']],
      include: [{
        model: sequelize.models.Users,
        as: 'user',
        attributes: [
          'username',
          'id',
          'full_name',
          'profile_picture',
          ['createdAt', 'created_time']
        ]
      }]
    })
  }

  model.createInstance = function(username, mediaExtention, bucket, mId) {
    const mediaId = mId || id()

    return this.create({
      id: mediaId,
      userUsername: username,
      images: {
        thumbnail: {
          url: `https://s3.eu-central-1.amazonaws.com/${bucket}/${mediaId}.${mediaExtention}`
        },
        low_resolution: {
          url: `https://s3.eu-central-1.amazonaws.com/${bucket}/${mediaId}.${mediaExtention}`
        },
        standard_resolution: {
          url: `https://s3.eu-central-1.amazonaws.com/${bucket}/${mediaId}.${mediaExtention}`
        }
      },
      type: 'image'
    })
  }

  return model
}
