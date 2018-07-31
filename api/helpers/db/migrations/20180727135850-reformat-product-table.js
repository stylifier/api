'use strict'

module.exports = {
  up: (queryInterface, Datatypes) => {
    return queryInterface.removeColumn('products', 'mediaId')
    .then(() =>
      queryInterface.removeColumn('products', 'price'))
    .then(() =>
      queryInterface.addColumn('products', 'media', Datatypes.JSON))
    .then(() =>
      queryInterface.addColumn('products', 'price', Datatypes.JSON))
    .then(() =>
      queryInterface.addColumn('products', 'sizes', {
        type: Datatypes.TEXT,
        defaultValue: ''
      }))
    .then(() =>
      queryInterface.addColumn('products', 'externalURL', {
        type: Datatypes.STRING,
        defaultValue: ''
      }))
    .then(() =>
      queryInterface.addColumn('products', 'brand', {
        type: Datatypes.STRING,
        defaultValue: ''
      }))
    .then(() =>
      queryInterface.addColumn('products', 'category', {
        type: Datatypes.TEXT,
        defaultValue: ''
      }))
    .then(() =>
      queryInterface.addColumn('products', 'color', {
        type: Datatypes.STRING,
        defaultValue: ''
      }))
    .then(() =>
      queryInterface.addColumn('products', 'subColor', {
        type: Datatypes.STRING,
        defaultValue: ''
      }))
    .then(() =>
      queryInterface.addColumn('products', 'colorPallet', {
        type: Datatypes.STRING,
        defaultValue: ''
      }))
  },

  down: (queryInterface, Datatypes) => {
    return queryInterface.addColumn('products', 'mediaId', Datatypes.STRING)
    .then(() =>
      queryInterface.removeColumn('products', 'media'))
    .then(() =>
      queryInterface.removeColumn('products', 'price'))
    .then(() =>
      queryInterface.addColumn('products', 'price', Datatypes.FLOAT))
    .then(() =>
      queryInterface.removeColumn('products', 'sizes'))
    .then(() =>
      queryInterface.removeColumn('products', 'externalURL'))
    .then(() =>
      queryInterface.removeColumn('products', 'brand'))
    .then(() =>
      queryInterface.removeColumn('products', 'category'))
    .then(() =>
      queryInterface.removeColumn('products', 'color'))
    .then(() =>
      queryInterface.removeColumn('products', 'subColor'))
    .then(() =>
      queryInterface.removeColumn('products', 'colorPallet'))
  }
}
