'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('media', 'description', Sequelize.TEXT)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('media', 'description')
  }
}
