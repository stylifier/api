'use strict'

module.exports = function(dependencies) {
  const {ColorPallets, ColorPalletBookmarks, ColorCodes} = dependencies.db

  return {
    createColorPallet: function(req, res, next) {
      const colorPallet = req.swagger.params.colorPallet.value
      const username = req.headers['x-consumer-username']

      ColorPallets.createInstance(colorPallet, username)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getCollorPalletSuggestion: function(req, res, next) {
      const colorCode = req.swagger.params.color_code.value

      ColorPallets.getCollorPalletSuggestion(colorCode)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    createColorPalletBookmart: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const palletId = req.swagger.params.palletId.value
      const title = req.swagger.params.title.value

      ColorPallets.getById(palletId)
      .then(t => t.update({
        popularity: t.dataValues.popularity + .1
      }))
      .then(() =>
        ColorPalletBookmarks.createInstance(username, palletId, title))
      .then(pallet => {
        res.json(pallet)
        next()
      })
      .catch(e => next(e))
    },

    deleteColorPalletBookmart: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const palletId = req.swagger.params.palletId.value

      ColorPallets.getById(palletId)
      .then(t => t.update({
        popularity: t.dataValues.popularity - .1
      }))
      .then(() =>
        ColorPalletBookmarks.deleteInstance(username, palletId))
      .then(() => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },

    getUsersColorPalletBookmart: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']

      ColorPalletBookmarks.getUserColorPalletBookmarks(username, offset)
      .then(r => r.map(i => Object.assign(
        {},
        i.pallet.dataValues,
        {
          title: i.title,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt
        }
      )))
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },

    getColorCodes: function(req, res, next) {
      ColorCodes.getColorCodes()
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },

    addColorCodes: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const name = req.swagger.params.body.value.name
      const code = req.swagger.params.body.value.code

      if (username !== 'ali')
        return next(Object.assign(
          new Error('only accessible by admin'),
          {statusCode: 401}))

      ColorCodes.addColorCodes(code, name)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getAllCollorPallet: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const minPopularity = req.swagger.params.min_popularity.value || 0
      const maxPopularity = req.swagger.params.max_popularity.value || 10

      if (username !== 'ali')
        return next(Object.assign(
          new Error('only accessible by admin'),
          {statusCode: 401}))

      ColorPallets.getAllCollorPallet(minPopularity, maxPopularity)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    }
  }
}
