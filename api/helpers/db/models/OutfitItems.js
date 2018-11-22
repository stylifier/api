'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('outfit_items', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    query: {
      type: Datatypes.JSON
    }
  })

  model.createInstance = function(item) {
    return this.create({
      id: id(),
      query: item.query,
      productId: item.product.id
    })
  }

  return model
}
