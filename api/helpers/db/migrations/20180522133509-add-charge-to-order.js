'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'charge', Sequelize.JSON)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('orders', 'charge')
  }
}
