'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('color_pallets', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      code: {type: Sequelize.STRING},
      likes: {type: Sequelize.DECIMAL},
      popularity: {type: Sequelize.DOUBLE},
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('color_pallets')
  }
}
