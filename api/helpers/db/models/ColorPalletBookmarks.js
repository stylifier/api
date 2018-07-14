'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('color_pallet_bookmarks', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    title: Datatypes.STRING,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.createInstance = function(username, palletId, title) {
    return this.findOne({
      where: {
        userUsername: username.toLowerCase(),
        palletId
      }
    }).then(f => {
      if (!f)
        return this.create({
          id: id(),
          userUsername: username.toLowerCase(),
          palletId,
          title
        })

      return f.update({title})
    })
  }

  model.getUserColorPalletBookmarks = function(username, offset, limit) {
    return this.findAll({
      where: {userUsername: username.toLowerCase()},
      include: [{
        model: sequelize.models.ColorPallets,
        as: 'pallet',
        attributes: sequelize.models.ColorPallets.shortAttributes
      }],
      offset: offset || 0,
      limit: limit || 2000
    })
  }

  return model
}
