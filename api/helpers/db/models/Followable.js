'use strict'

module.exports = (sequelize, Datatypes) => 
  sequelize.define('followable', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })
