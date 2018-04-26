/* eslint-disable camelcase */
/* eslint-disable new-cap */
'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('orderable', {})

  model.createInstance = function({productId, orderId}) {
    return this.create({
      productId,
      orderId
    })
  }

  model.getOrderItem = function({id}) {
    return this.findOne({
      where: {
        id: id
      },
      include: [{
        model: sequelize.models.Orders,
        as: 'order'
      }]
    })
  }

  return model
}
