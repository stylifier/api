'use strict'

module.exports = function(dependencies) {
  const {ColorPallets} = dependencies.db

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
    }
  }
}
