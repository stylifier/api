'use strict'

module.exports = (sequelize, Datatypes) => 
  sequelize.define('threads', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    status: Datatypes.STRING,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })
