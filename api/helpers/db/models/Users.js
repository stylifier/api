'use strict'

module.exports = (sequelize, Datatypes) =>
  sequelize.define('users', {
    username: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    full_name: Datatypes.STRING,
    password: Datatypes.STRING,
    profile_picture: Datatypes.STRING,
    id: Datatypes.STRING,
    bio: Datatypes.TEXT,
    contribution_earned: Datatypes.DOUBLE,
    rating: Datatypes.DOUBLE,
    is_instagram_user: Datatypes.BOOLEAN,
    is_brand: Datatypes.BOOLEAN,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })
