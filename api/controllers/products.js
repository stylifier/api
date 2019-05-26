'use strict'

module.exports = function(dependencies) {
  const {Products, ProductBookmarks, Categories} = dependencies.db

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
      const offset = req.swagger.params.pagination.value || 0
      const query = {
        name: req.swagger.params.name.value,
        brand: req.swagger.params.brand.value ? req.swagger.params.brand.value.split(',') : undefined,
        color: req.swagger.params.color.value,
        subColor: req.swagger.params.sub_color.value,
        category: req.swagger.params.category.value,
        hex: req.swagger.params.hex.value,
        code: req.swagger.params.code.value,
        size: req.swagger.params.size.value ? req.swagger.params.size.value.split(',') : undefined,
      }

      const attachSizesAndBrands = async products => ({
        data: products,
        pagination: offset + products.length,
        sizes: await Products.getSizes(username, query),
        brands: await Products.getBrands(username, query),
      })

      Products.getProducts(username, query, offset)
      .then(products => attachSizesAndBrands(products))
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getUserProducts: function(req, res, next) {
      const username = req.swagger.params.username.value
      const offset = req.swagger.params.pagination.value || 0
      const query = {
        name: req.swagger.params.name.value,
        brand: req.swagger.params.brand.value ? req.swagger.params.brand.value.split(',') : undefined,
        color: req.swagger.params.color.value,
        subColor: req.swagger.params.sub_color.value,
        category: req.swagger.params.category.value,
        hex: req.swagger.params.hex.value,
        code: req.swagger.params.code.value,
        size: req.swagger.params.size.value ? req.swagger.params.size.value.split(',') : undefined,
      }

      const attachSizesAndBrands = async products => ({
        data: products,
        pagination: offset + products.length,
        sizes: await Products.getSizes(username, query),
        brands: await Products.getBrands(username, query),
      })

      Products.getProducts(username, query, offset)
      .then(products => attachSizesAndBrands(products))
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getProducts: function(req, res, next) {
      const name = req.swagger.params.name.value
      const brand = req.swagger.params.brand.value
      const color = req.swagger.params.color.value
      const subColor = req.swagger.params.sub_color.value
      const offset = req.swagger.params.pagination.value || 0
      const category = req.swagger.params.category.value
      const hex = req.swagger.params.hex.value

      Products.getProducts(undefined, {
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
    createProductBookmart: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const palletId = req.swagger.params.pallet_id.value
      const productId = req.swagger.params.productId.value
      const title = req.swagger.params.title.value

      ProductBookmarks.createInstance(username, palletId, productId, title)
      .then(pallet => {
        res.json(pallet)
        next()
      })
      .catch(e => next(e))
    },

    deleteProductBookmart: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const palletId = req.swagger.params.pallet_id.value
      const productId = req.swagger.params.productId.value

      ProductBookmarks.deleteInstance(username, palletId, productId)
      .then(() => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },

    getUsersProductBookmart: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']

      ProductBookmarks.getUserProductBookmarks(username, offset)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },

    getProductCategories: function(req, res, next) {
      Categories.getActiveCategories()
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },

    getById: function(req, res, next) {
      const id = req.swagger.params.id.value

      Products.getById(id)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    }
  }
}
