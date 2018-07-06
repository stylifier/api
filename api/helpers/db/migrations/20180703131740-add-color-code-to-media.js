'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('media', 'colorCode', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('media', 'colorCode')
  }
}
