'use strict'
const id = require('uniqid')

module.exports = function(dependencies) {
  const {Outfits, Users} = dependencies.db

  return {
    createOutfit: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const body = req.swagger.params.body.value
      const items = body.items || []
      const title = body.title || ''
      const palletId = body.palletId || ''
      const gender = body.gender || ''

      Users.findUserByUsername(username, true)
      .then(u =>
        Outfits.findOutfit(username, body.id || 'INVALID' + id)
        .then(o => o ?
          Outfits.updateInstance(
            username, items, o.id, title, u.country_code, o.gender, palletId) :
          Outfits.createInstance(
            username, items, title, u.country_code, gender, palletId))
        )
      .then(r => {
        res.json(r.dataValues)
        next()
      })
      .catch(e => next(e))
    },
    updateOutfit: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const body = req.swagger.params.body.value
      const items = body.items || []
      const title = body.title || ''
      const id = req.swagger.params.id.value
      const palletId = body.palletId || ''
      const gender = body.gender || ''

      Users.findUserByUsername(username, true)
      .then(u =>
        Outfits.updateInstance(
          username, items, id, title, u.country_code, gender, palletId))
      .then(r => {
        res.json(r.dataValues)
        next()
      })
      .catch(e => next(e))
    },
    getUserOutfits: function(req, res, next) {
      const username = req.headers['x-consumer-username']

      Outfits.getUserOutfits(username)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
  }
}
