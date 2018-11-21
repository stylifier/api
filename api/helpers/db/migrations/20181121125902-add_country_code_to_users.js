'use strict'

module.exports = {
  up: (queryInterface, Datatypes) => {
    return queryInterface.addColumn('users', 'country_code', {
      type: Datatypes.STRING,
      defaultValue: null
    })
  },

  down: (queryInterface, Datatypes) => {
    return queryInterface.removeColumn('users', 'country_code')
  }
}
