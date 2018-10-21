'use strict'

module.exports = {
  up: (queryInterface, Datatypes) => {
    return queryInterface.addColumn('color_pallets', 'creator_username', {
      type: Datatypes.STRING,
      defaultValue: null
    })
  },

  down: (queryInterface, Datatypes) => {
    return queryInterface.removeColumn('color_pallets', 'creator_username')
  }
}
