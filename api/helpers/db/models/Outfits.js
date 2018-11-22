/* eslint-disable camelcase */
'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('outfits', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    title: {
      type: Datatypes.STRING
    },
    country_code: {
      type: Datatypes.STRING
    },
    gender: {
      type: Datatypes.STRING
    },
  })

  model.createInstance = function(username, items, title, country_code, gender, palletId) {
    return this.create(Object.assign({
      id: id(),
      title,
      country_code,
      userUsername: username,
      gender
    }, palletId ? {palletId} : {}))
    .then(o =>
      Promise.all(
        items.map(p =>
          sequelize.models.OutfitItems.createInstance(p)
          .then(np => o.addItem(np))
      ))
      .then(() => this.getOutfit(username, o.id))
    )
  }

  model.updateInstance = function(username, products, id, title, country_code, gender, palletId) {
    return this.findOne({
      where: {
        userUsername: username,
        id
      },
      include: [{
        model: sequelize.models.OutfitItems,
        as: 'items',
      }]
    })
    .then(t => Promise.all(t.items.map(t => t.destroy())).then(() => t))
    .then(t =>
      Promise.all(
        products.map(p =>
          sequelize.models.OutfitItems.createInstance(p)
          .then(np => t.addItem(np))
      )).then(() => t))
    .then(t => t.update(Object.assign(
      {title, country_code, gender}, palletId ? {palletId} : {})))
    .then(o => this.getOutfit(username, o.id))
  }

  model.getUserOutfits = function(username) {
    return this.findAll({
      where: {
        userUsername: username
      },
      include: [{
        model: sequelize.models.OutfitItems,
        as: 'items',
        include: [
          {
            model: sequelize.models.Products,
            as: 'product',
            include: [{
              model: sequelize.models.Addresses,
              as: 'shopAddress'
            }]
          }
        ]
      }]
    })
  }

  model.getOutfit = function(username, id) {
    return this.findOne({
      where: {
        userUsername: username,
        id
      },
      include: [{
        model: sequelize.models.OutfitItems,
        as: 'items',
        include: [
          {
            model: sequelize.models.Products,
            as: 'product',
            include: [{
              model: sequelize.models.Addresses,
              as: 'shopAddress'
            }]
          }
        ]
      }]
    })
  }

  model.findOutfit = function(username, id) {
    return this.findOne({
      where: {
        userUsername: username,
        id
      }
    })
  }

  return model
}
