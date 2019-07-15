/* eslint-disable camelcase */
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
    creator_username: {type: Datatypes.STRING},
    likes: {type: Datatypes.DECIMAL},
    popularity: {type: Datatypes.DOUBLE},
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE,
  })

  model.getById = function(id) {
    return this.findOne({where: {id}})
  }

  model.createInstance = function(colorPallet, username) {
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
        creator_username: username,
        code: colorPallet.code,
        likes: colorPallet.likes ? colorPallet.likes : 0,
        popularity: colorPallet.popularity ? colorPallet.popularity : .9,
      })
    )
  }

  model.shortAttributes = [
    'id',
    'code',
    'popularity',
    'creator_username',
    'createdAt'
  ]

  model.getAllCollorPallet = function(minPopularity, maxPopularity) {
    return this.findAll({
      limit: 20000,
      attributes: this.shortAttributes,
      order: [['createdAt', 'DESC']],
      where: {
        popularity: {
          [Datatypes.Op.and]: [
            {[Datatypes.Op.gte]: minPopularity},
            {[Datatypes.Op.lte]: maxPopularity},
          ]
        }
      },
      include: [{
        model: sequelize.models.Media,
        as: 'media',
      }],
    })
  }

  model.getCollorPalletSuggestion = function(targetCode) {
    return this.findAll({
      limit: 20000,
      attributes: this.shortAttributes,
      where: {
        popularity: {
          [Datatypes.Op.gte]: 1.1
        }
      }
    })
    .then(r =>
      r.map(c => Object.assign(c, {
        pallet: [
          '#' + c.code.slice(0, 6),
          '#' + c.code.slice(6, 12),
          '#' + c.code.slice(12, 18),
          '#' + c.code.slice(18, 24)],
        popularity: c.popularity > 5 ? 5 : c.popularity,
      }))
      .filter(c => c.popularity > 1)
      .map(c => Object.assign(c, {
        diff: c.pallet
          .map(p => cd.compare(p, targetCode))
          .sort((a, b) => a - b)[0]
      }))
      .sort((a, b) => a.diff - b.diff).slice(0, 30)
      .map(r => Object.assign(r.dataValues, {diff: r.diff})))
  }

  return model
}
