/* eslint-disable camelcase */
/* eslint-disable new-cap */
'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('orders', {
    status: Datatypes.ENUM(
      'OPEN',
      'ORDERED',
      'READY_TO_PICK_UP',
      'DELIVERED')
  })

  model.createInstance = function(username) {
    return this.create({
      userUsername: username.toLowerCase(),
      status: 'OPEN'
    })
  }

  model.getOrders = function(username, status) {
    return this.findAll({
      where: Object.assign({
        userUsername: username
      }, status ? {status} : {}),
      include: [{
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      },
      {
        model: sequelize.models.Orderable,
        as: 'items',
        include: [
          {
            model: sequelize.models.Products,
            as: 'product',
            include: [{
              model: sequelize.models.Addresses,
              as: 'shopAddress'
            },
            {
              model: sequelize.models.Media,
              as: 'media'
            }]
          }
        ]
      }]
    })
  }

  model.getOrderById = function(username, id) {
    return this.findOne({
      where: {
        userUsername: username,
        id
      },
      include: [{
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      },
      {
        model: sequelize.models.Orderable,
        as: 'items',
        include: [
          {
            model: sequelize.models.Products,
            as: 'product',
            include: [{
              model: sequelize.models.Addresses,
              as: 'shopAddress'
            },
            {
              model: sequelize.models.Media,
              as: 'media'
            }]
          }
        ]
      }]
    })
  }

  model.getOpenOrders = function(username) {
    return model.getOrders(username, 'OPEN')
  }

  model.getClosedOrders = function(username) {
    return model.getOrders(username, {
      [Datatypes.Op.or]: [
        'ORDERED',
        'READY_TO_PICK_UP',
        'DELIVERED']
    })
  }

  model.getAllOrders = function(username) {
    return model.getOrders(username, {
      [Datatypes.Op.or]: [
        'OPEN',
        'ORDERED',
        'READY_TO_PICK_UP',
        'DELIVERED']
    })
  }

  return model
}
