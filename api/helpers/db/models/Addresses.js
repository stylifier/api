/* eslint-disable camelcase */
'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('addresses', {
    street: Datatypes.STRING,
    postal_code: Datatypes.DECIMAL,
    country: Datatypes.STRING,
    note: Datatypes.STRING,
    city: Datatypes.STRING
  })

  const attributes = [
    'id',
    'street',
    'note',
    ['postal_code', 'postalCode'],
    'country',
    'city',
    'updatedAt',
    ['createdAt', 'created_time']
  ]

  model.createInstance = function({
    username, street, postalCode, city, country
  }) {
    return this.create({
      userUsername: username.toLowerCase(),
      street: street.toLowerCase(),
      postal_code: postalCode,
      city: city.toLowerCase(),
      country: country.toLowerCase()
    })
  }

  model.getAddresses = function(username) {
    return this.findAll({
      where: {
        userUsername: username
      },
      attributes: attributes
    })
  }

  model.getAddress = function(username, id) {
    return this.findOne({
      where: {
        userUsername: username,
        id
      },
      attributes: attributes
    })
  }

  return model
}
