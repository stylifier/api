/* eslint-disable camelcase */
/* eslint-disable new-cap */
'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('orderable', {
    status: Datatypes.ENUM(
      'ORDERED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED')
  })

  model.createInstance = function(username) {
    return this.create({
      userUsername: username.toLowerCase(),
      status: 'ORDERED'
    })
  }

  return model
}
