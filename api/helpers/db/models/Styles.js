'use strict'

module.exports = (sequelize, Datatypes) => {
  return sequelize.define('styles', {
    name: {
      type: Datatypes.STRING,
      primaryKey: true
    }
  })
}
