'use strict'

module.exports = (sequelize, Datatypes) => 
  sequelize.define('media', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    images: Datatypes.JSON,
    type: Datatypes.STRING,
    is_user_liked: Datatypes.BOOLEAN,
    location: Datatypes.JSON,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })
