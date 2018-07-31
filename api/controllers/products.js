'use strict'

module.exports = function(dependencies) {
  const {Products} = dependencies.db

  return {
    createProduct: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const {
          name,
          code,
          price,
          media,
          sizes,
          externalURL,
          brand,
          category,
          color,
          subColor,
          colorPallet,
          shopAddress
        } = req.swagger.params.body.value

      Products.createInstance({
        name,
        code,
        price,
        media,
        sizes,
        externalURL,
        brand,
        category,
        color,
        subColor,
        colorPallet,
        shopAddress,
        username
      })
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getSelfProducts: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const name = req.swagger.params.name.value
      const brand = req.swagger.params.brand.value
      const color = req.swagger.params.color.value
      const subColor = req.swagger.params.sub_color.value
      const offset = req.swagger.params.pagination.value || 0
      const category = req.swagger.params.category.value
      const hex = req.swagger.params.hex.value

      Products.getProducts(username, {
        name,
        brand,
        color,
        subColor,
        category,
        hex
      }, offset)
      .then(r => {
        res.json({
          data: r,
          pagination: offset + r.length
        })
        next()
      })
      .catch(e => next(e))
    },
    getUserProducts: function(req, res, next) {
      const username = req.swagger.params.username.value
      const name = req.swagger.params.name.value
      const brand = req.swagger.params.brand.value
      const color = req.swagger.params.color.value
      const subColor = req.swagger.params.sub_color.value
      const offset = req.swagger.params.pagination.value || 0
      const category = req.swagger.params.category.value
      const hex = req.swagger.params.hex.value

      Products.getProducts(username, {
        name,
        brand,
        color,
        subColor,
        category,
        hex
      }, offset)
      .then(r => {
        res.json({
          data: r,
          pagination: offset + r.length
        })
        next()
      })
      .catch(e => next(e))
    }
  }
}
