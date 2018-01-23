'use strict'

module.exports = function(s, Datatypes) {
  s.models.Users = require('./Users')(s, Datatypes)
  s.models.Styles = require('./Styles')(s, Datatypes)
  s.models.Threads = require('./Threads')(s, Datatypes)
  s.models.Messages = require('./Messages')(s, Datatypes)
  s.models.Media = require('./Media')(s, Datatypes)
  s.models.Followable = require('./Followable')(s, Datatypes)
  s.models.Subscriptions = require('./Subscriptions')(s, Datatypes)

  s.models.Users.belongsToMany(s.models.Styles, {
    as: 'styles',
    through: 'user_style'
  })
  s.models.Users.belongsToMany(s.models.Users, {
    as: 'sponsors',
    through: 'sponsor'
  })

  s.models.Threads.belongsTo(s.models.Users, {as: 'from'})
  s.models.Threads.belongsTo(s.models.Users, {as: 'to'})

  s.models.Followable.belongsTo(s.models.Users, {as: 'follower'})
  s.models.Followable.belongsTo(s.models.Users, {as: 'followed_by'})

  s.models.Messages.belongsTo(s.models.Threads, {as: 'thread'})
  s.models.Messages.hasMany(s.models.Media, {as: 'media'})

  s.models.Media.belongsTo(s.models.Users, {as: 'user'})
  s.models.Media.belongsToMany(s.models.Users, {
    as: 'users_in_photo',
    through: 'tagable'
  })

  s.models.Subscriptions.belongsTo(s.models.Users, {as: 'user'})

  return {
    Users: s.models.Users,
    Styles: s.models.Styles,
    Threads: s.models.Threads,
    Messages: s.models.Messages,
    Media: s.models.Media,
    Followable: s.models.Followable,
    Subscriptions: s.models.Subscriptions
  }
}
