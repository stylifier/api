'use strict'

module.exports = function(dependencies) {
  const {ColorPallets, ColorPalletBookmarks} = dependencies.db

  return {
    createColorPallet: function(req, res, next) {
      const username = req.headers['x-consumer-username']

      if (username !== 'ali')
        return next(Object.assign(
          new Error('only accessible by admin'),
          {statusCode: 401}))

      const colorPallet = req.swagger.params.colorPallet.value

      ColorPallets.createInstance(colorPallet)
      .then(r => {
        res.json({success: true})
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

      ColorPalletBookmarks.createInstance(username, palletId, title)
      .then(pallet => {
        res.json(pallet)
        next()
      })
      .catch(e => next(e))
    },

    deleteColorPalletBookmart: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const palletId = req.swagger.params.palletId.value

      ColorPalletBookmarks.deleteInstance(username, palletId)
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
    }
  }
}