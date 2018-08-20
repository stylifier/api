'use strict'

module.exports = {
  up: (queryInterface, Datatypes) => {
    return queryInterface.createTable('product_bookmarks', {
      id: {
        type: Datatypes.STRING,
        primaryKey: true
      },
      title: Datatypes.STRING,
      userUsername: Datatypes.STRING,
      palletId: Datatypes.STRING,
      productId: Datatypes.INTEGER,
      createdAt: Datatypes.DATE,
      updatedAt: Datatypes.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('product_bookmarks')
  }
}
