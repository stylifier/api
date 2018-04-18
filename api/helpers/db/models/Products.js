/* eslint-disable camelcase */
'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('products', {
    name: Datatypes.STRING,
    code: Datatypes.STRING,
    price: Datatypes.FLOAT,
  })

  model.createInstance = function(username, mediaId, name, code, price, shopAddressId) {
    return this.create({
      name: name.toLowerCase(),
      code: code.toLowerCase(),
      price: price,
      mediaId: mediaId,
      shopAddressId: shopAddressId,
      userUsername: username.toLowerCase()
    })
  }

  model.getProducts = function(username, quary) {
    return this.findAll({
      where: Object.assign({userUsername: username.toLowerCase()},
        quary ? {name: {[Datatypes.Op.like]: `%${quary}%`}} : {}),
      limit: 10,
      include: [{
        model: sequelize.models.Media,
        as: 'media'
      },
      {
        model: sequelize.models.Addresses,
        as: 'shopAddress'
      },
      {
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      }]
    })
  }

  model.getSelfProducts = function(username) {
    return this.findAll({
      where: {userUsername: username},
      include: [{
        model: sequelize.models.Media,
        as: 'media'
      },
      {
        model: sequelize.models.Addresses,
        as: 'shopAddress'
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
