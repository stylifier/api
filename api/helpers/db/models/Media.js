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
    is_public: Datatypes.BOOLEAN,
    updatedAt: Datatypes.DATE
  })

  model.getMediaByUsernames = function(usernames, offset) {
    return this.findAll({
      where: {userUsername: {[Datatypes.Op.in]: usernames}, is_public: true},
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
      order: [['createdAt', 'DESC']],
      include: [{
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.shortAttributes
      }]
    })
  }

  model.createOrUpdateInstances = function(media, username) {
    return Promise.all(media.reverse()
        .map(m => this.findOne({where: {id: m.id}})
      .then(obj => obj ?
        obj.update({images: m.images, location: m.location}) :
        this.create({
          id: m.id,
          userUsername: username,
          images: m.images,
          location: m.location,
          type: 'image',
          is_public: true
        })
      )
    ))
  }

  model.createInstance = function(username, mediaExtention, bucket, mId, isPublic) {
    const mediaId = mId || id()

    return this.create(Object.assign({
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
    }, isPublic ? {is_public: isPublic} : {is_public: true}))
  }

  return model
}
