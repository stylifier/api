'use strict'

module.exports = (sequelize, Datatypes) => 
  sequelize.define('messages', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    text: Datatypes.TEXT,
    status: Datatypes.STRING,
    senderUsername: Datatypes.STRING,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })
