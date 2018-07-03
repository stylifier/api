'use strict'
const id = require('uniqid')
const cd = require('color-difference')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('color_pallets', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    code: {type: Datatypes.STRING},
    likes: {type: Datatypes.DECIMAL},
    popularity: {type: Datatypes.DOUBLE},
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.createInstance = function(colorPallet) {
    return this.findOne({
      where: {code: colorPallet.code}
    })
    .then(cp => cp ?
      cp.update({
        likes: colorPallet.likes,
        popularity: colorPallet.popularity
      }) :
      this.create({
        id: id(),
        code: colorPallet.code,
        likes: colorPallet.likes ? colorPallet.likes : 0,
        popularity: colorPallet.popularity ? colorPallet.popularity : 2,
      })
    )
  }

  model.getCollorPalletSuggestion = function(targetCode) {
    return this.findAll({
      limit: 20000,
      attributes: [
        'id',
        'code',
        'popularity'
      ]
    })
    .then(r =>
      r.map(c => Object.assign(c, {
        pallet: [
          '#' + c.code.slice(0, 6),
          '#' + c.code.slice(6, 12),
          '#' + c.code.slice(12, 18),
          '#' + c.code.slice(18, 24)]
      }))
      .map(c => Object.assign(c, {
        diff: c.pallet
          .map(p => cd.compare(p, targetCode))
          .sort((a, b) => a - b)[0]
      }))
      .sort((a, b) => a.diff - b.diff).slice(0, 10)
      .map(r => Object.assign(r.dataValues, {diff: r.diff})))
  }

  return model
}
