'use strict'

module.exports = {
  up: (queryInterface, Datatypes) => {
    return queryInterface.createTable('color_pallet_bookmarks', {
      id: {
        type: Datatypes.STRING,
        primaryKey: true
      },
      title: Datatypes.STRING,
      userUsername: Datatypes.STRING,
      palletId: Datatypes.STRING,
      createdAt: Datatypes.DATE,
      updatedAt: Datatypes.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('color_pallet_bookmarks')
  }
}
