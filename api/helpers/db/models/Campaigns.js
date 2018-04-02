/* eslint-disable camelcase */
'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('campaigns', {
    description: Datatypes.STRING,
    location: Datatypes.JSON,
    approved: Datatypes.BOOLEAN,
    rejection_reason: Datatypes.STRING,
    expired: {type: Datatypes.BOOLEAN, defaultValue: false}
  })

  model.createInstance = function(username, mediaId, location, description) {
    return this.create({
      location: location,
      description: description,
      mediaId: mediaId,
      userUsername: username.toLowerCase()
    })
  }

  model.getCampaigns = function(styles, location) {
    return this.findAll({
      where: {
        approved: true,
        expired: false,
      },
      limit: 6,
      include: [{
        model: sequelize.models.Media,
        as: 'media'
      },
      {
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      }]
    })
  }

  model.getSelfCampaigns = function(username) {
    return this.findAll({
      where: {
        userUsername: username
      },
      include: [{
        model: sequelize.models.Media,
        as: 'media'
      },
      {
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      }]
    })
  }

  return model
}
