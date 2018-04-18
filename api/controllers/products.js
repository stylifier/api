'use strict'

module.exports = function(dependencies) {
  const Products = dependencies.db.Products

  return {
    createProduct: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const mediaId = req.swagger.params.body.value.media.id
      const name = req.swagger.params.body.value.name
      const price = req.swagger.params.body.value.price
      const code = req.swagger.params.body.value.code
      const addressId = req.swagger.params.body.value.shopAddress.id

      Products.createInstance(username, mediaId, name, code, price, addressId)
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getProducts: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const query = req.swagger.params.q.value

      Products.getProducts(username, query)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getSelfProducts: function(req, res, next) {
      const username = req.headers['x-consumer-username']

      Products.getSelfProducts(username)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    }
  }
}
