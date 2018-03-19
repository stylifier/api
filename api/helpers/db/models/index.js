'use strict'

module.exports = function(s, Datatypes) {
  s.models.Users = require('./Users')(s, Datatypes)
  s.models.Styles = require('./Styles')(s, Datatypes)
  s.models.Threads = require('./Threads')(s, Datatypes)
  s.models.Messages = require('./Messages')(s, Datatypes)
  s.models.Media = require('./Media')(s, Datatypes)
  s.models.Followable = require('./Followable')(s, Datatypes)
  s.models.Subscriptions = require('./Subscriptions')(s, Datatypes)
  s.models.Sponsorable = require('./Sponsorable')(s, Datatypes)

  s.models.Users.belongsToMany(s.models.Styles, {
    as: 'styles',
    through: 'user_style'
  })

  s.models.Threads.hasMany(s.models.Media, {as: 'media'})
  s.models.Threads.belongsTo(s.models.Users, {as: 'from'})
  s.models.Threads.belongsTo(s.models.Users, {as: 'to'})

  s.models.Followable.belongsTo(s.models.Users, {as: 'follower'})
  s.models.Followable.belongsTo(s.models.Users, {as: 'followed_by'})

  s.models.Messages.belongsTo(s.models.Threads, {as: 'thread'})
  s.models.Messages.hasMany(s.models.Media, {as: 'media'})

  s.models.Media.belongsTo(s.models.Users, {as: 'user'})
  s.models.Media.belongsToMany(s.models.Users, {
    as: 'usersInPhoto',
    through: 'tagable'
  })

  s.models.Sponsorable.belongsTo(s.models.Users, {as: 'sponsor'})
  s.models.Sponsorable.belongsTo(s.models.Users, {as: 'sponsored_by'})

  // s.models.Media.sync({force: true})
  // s.models.Threads.sync({force: true})

  s.models.Subscriptions.belongsTo(s.models.Users, {as: 'user'})

  return {
    Users: s.models.Users,
    Styles: s.models.Styles,
    Threads: s.models.Threads,
    Messages: s.models.Messages,
    Media: s.models.Media,
    Followable: s.models.Followable,
    Sponsorable: s.models.Sponsorable,
    Subscriptions: s.models.Subscriptions
  }
}
