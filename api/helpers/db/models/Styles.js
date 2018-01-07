'use strict'

module.exports = (sequelize, Datatypes) => 
  sequelize.define('styles', {
    name: {
      type: Datatypes.STRING,
      primaryKey: true
    }
  })
