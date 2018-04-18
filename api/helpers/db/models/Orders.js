/* eslint-disable camelcase */
/* eslint-disable new-cap */
'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('orders', {
    status: Datatypes.ENUM('OPEN', 'CLOSED')
  })

  model.createInstance = function(username) {
    return this.create({
      userUsername: username.toLowerCase()
    })
  }

  model.getSelfOrders = function(username) {
    return this.findAll({
      where: {
        userUsername: username
      },
      include: [{
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      }]
    })
  }

  return model
}
