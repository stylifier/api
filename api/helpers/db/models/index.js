'use strict'

module.exports = function(sequelize, Datatypes) {
  const Users = require('./Users')(sequelize, Datatypes)
  const Styles = require('./Styles')(sequelize, Datatypes)
  const Threads = require('./Threads')(sequelize, Datatypes)
  const Messages = require('./Messages')(sequelize, Datatypes)
  const Media = require('./Media')(sequelize, Datatypes)
  const Followable = require('./Followable')(sequelize, Datatypes)
  
  Users.belongsToMany(Styles, {as: 'styles', through: 'user_style'})
  Users.belongsToMany(Users, {as: 'sponsors', through: 'sponsor'})
  
  Threads.belongsTo(Users, {as: 'from'})
  Threads.belongsTo(Users, {as: 'to'})
  
  Followable.belongsTo(Users, {as: 'follower'})
  Followable.belongsTo(Users, {as: 'followed_by'})
  
  Messages.belongsTo(Threads, {as: 'thread'})
  Messages.hasMany(Media, {as: 'media'})
  
  Media.belongsTo(Users, {as: 'user'})
  Media.belongsToMany(Users, {as: 'users_in_photo', through: 'tagable'})
  
  return {
    Users: Users,
    Styles: Styles,
    Threads: Threads,
    Messages: Messages,
    Media: Media,
    Followable: Followable,
    Op: Datatypes.Op
  }
}