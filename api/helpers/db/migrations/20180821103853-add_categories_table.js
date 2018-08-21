'use strict'
const data = require('./init_categories.json')
  .map(t => Object.assign(t, {createdAt: new Date(), updatedAt: new Date()}))

module.exports = {
  up: (queryInterface, Datatypes) => {
    return queryInterface.createTable('categories', {
      id: {
        type: Datatypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      address: Datatypes.STRING,
      lable: Datatypes.STRING,
      active: Datatypes.BOOLEAN,
    })
    .then(() =>
      queryInterface.sequelize.query(
        queryInterface.QueryGenerator.bulkInsertQuery('categories', data)))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories')
  }
}
