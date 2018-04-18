'use strict'

module.exports = function(dependencies) {
  const Addresses = dependencies.db.Addresses

  return {
    createAddress: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const city = req.swagger.params.body.value.city
      const country = req.swagger.params.body.value.country
      const postalCode = req.swagger.params.body.value.postalCode
      const street = req.swagger.params.body.value.street

      Addresses.createInstance({username, street, postalCode, city, country})
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getAddresses: function(req, res, next) {
      const username = req.headers['x-consumer-username']

      Addresses.getAddresses(username)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    deleteAddress: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const id = req.swagger.params.id.value

      Addresses.getAddress(username, id)
      .then(r => r.destroy())
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
  }
}
