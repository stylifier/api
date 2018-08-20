'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('product_bookmarks', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    title: Datatypes.STRING,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.createInstance = function(username, palletId, productId, title) {
    return this.findOne({
      where: Object.assign({userUsername: username.toLowerCase(), productId},
        palletId ? {palletId} : {}),
    }).then(f => {
      if (!f)
        return this.create({
          id: id(),
          userUsername: username.toLowerCase(),
          palletId,
          productId,
          title
        })

      return f.update({title})
    })
  }

  model.getUserProductBookmarks = function(username, offset, limit) {
    return this.findAll({
      where: {userUsername: username.toLowerCase()},
      include: [{
        model: sequelize.models.ColorPallets,
        as: 'pallet',
        attributes: sequelize.models.ColorPallets.shortAttributes
      },
      {
        model: sequelize.models.Products,
        as: 'product'
      }],
      offset: offset || 0,
      limit: limit || 2000
    })
  }

  model.deleteInstance = function(username, palletId, productId) {
    return this.findOne({
      where: Object.assign({userUsername: username.toLowerCase(), productId},
        palletId ? {palletId} : {}),
    })
    .then(bm => bm && bm.destroy())
  }

  return model
}
