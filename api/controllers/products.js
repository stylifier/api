'use strict'

module.exports = function(dependencies) {
  const {Products} = dependencies.db

  return {
    createProduct: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const {
        media,
        name,
        price,
        code,
        shopAddress} = req.swagger.params.body.value

      Products.createInstance(
        username, media.id, name, code, price, shopAddress.id)
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
