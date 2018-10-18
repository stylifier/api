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
    style: Datatypes.STRING,
    is_user_liked: Datatypes.BOOLEAN,
    location: Datatypes.JSON,
    createdAt: Datatypes.DATE,
    is_public: Datatypes.BOOLEAN,
    description: Datatypes.TEXT,
    updatedAt: Datatypes.DATE,
    colorCode: Datatypes.STRING
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
        'description',
        'userUsername',
        'is_user_liked',
        'style',
        'colorCode',
        'location',
        'updatedAt',
        ['createdAt', 'created_time']
      ],
      order: [['createdAt', 'DESC']],
      include: [{
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      },
      {
        model: sequelize.models.Users,
        as: 'usersInPhoto',
        attributes: sequelize.models.Users.shortAttributes
      },
      {
        model: sequelize.models.Products,
        as: 'products'
      }]
    })
  }

  model.getMediaByStyle = function(style, offset) {
    return this.findAll({
      where: {
        style: {[Datatypes.Op.like]: `${style.toLowerCase()}%`},
        is_public: true
      },
      offset: offset,
      limit: 20,
      attributes: [
        'id',
        'images',
        'type',
        'description',
        'userUsername',
        'is_user_liked',
        'style',
        'colorCode',
        'location',
        'updatedAt',
        ['createdAt', 'created_time']
      ],
      order: [['createdAt', 'DESC']],
      include: [{
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      },
      {
        model: sequelize.models.Users,
        as: 'usersInPhoto',
        attributes: sequelize.models.Users.shortAttributes
      },
      {
        model: sequelize.models.Products,
        as: 'products'
      }]
    })
  }

  model.getMediaByThreadId = function(threadId) {
    return this.findAll({
      where: {threadId: threadId},
      limit: 20,
      attributes: [
        'id',
        'images',
        'type',
        'description',
        'is_user_liked',
        'location',
        'style',
        'colorCode',
        'updatedAt',
        ['createdAt', 'created_time']
      ],
      order: [['createdAt', 'DESC']]
    })
  }

  model.getMediaById = function(id) {
    return this.findOne({where: {id: id}})
  }

  model.addDescriptionToMedia = function(username, id, description) {
    return this.findOne({
      where: {
        id,
        userUsername: username}})
    .then(m =>
      m.update({description}))
  }

  model.createOrUpdateInstances = function(media, username) {
    return Promise.all(media.reverse()
        .map(m => this.findOne({where: {id: m.id}})
      .then(obj => obj ?
        obj.update({images: m.images, location: m.location}) :
        this.create({
          id: m.id,
          userUsername: username.toLowerCase(),
          images: m.images,
          style: m.style,
          colorCode: m.colorCode,
          location: m.location,
          type: 'image',
          is_public: true
        })
      )
    ))
  }

  model.createInstance = function(username, mediaExtention, bucket, mId, isPublic, colorCode) {
    const mediaId = mId || id()

    return this.create({
      id: mediaId,
      userUsername: username.toLowerCase(),
      colorCode: colorCode,
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
      is_public: isPublic,
      type: 'image'
    })
  }

  model.getStyles = function(q, user) {
    return this.findAll({
      where: {
        [Datatypes.Op.and]: [
          {style: {[Datatypes.Op.ne]: null}}
        ].concat(q ?
          [{style: {[Datatypes.Op.like]: `${q.toLowerCase()}%`}}] : []
        ).concat(user ? [{userUsername: user}] : [])
      },
      attributes: [
        'style',
        [sequelize.fn('count', sequelize.col('style')), 'stylecount']
      ],
      limit: 20,
      group: ['style'],
      order: [[sequelize.fn('count', sequelize.col('style')), 'DESC']],
    })
  }

  return model
}
