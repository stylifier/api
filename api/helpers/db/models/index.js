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
  s.models.Campaigns = require('./Campaigns')(s, Datatypes)
  s.models.Products = require('./Products')(s, Datatypes)
  s.models.Invites = require('./Invites')(s, Datatypes)
  s.models.Orders = require('./Orders')(s, Datatypes)
  s.models.Orderable = require('./Orderable')(s, Datatypes)
  s.models.Addresses = require('./Addresses')(s, Datatypes)

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
  s.models.Messages.belongsToMany(s.models.Products, {
    as: 'products',
    through: 'message_product'
  })

  s.models.Media.belongsTo(s.models.Users, {as: 'user'})
  s.models.Media.belongsToMany(s.models.Users, {
    as: 'usersInPhoto',
    through: 'tagable'
  })

  s.models.Sponsorable.belongsTo(s.models.Users, {as: 'sponsor'})
  s.models.Sponsorable.belongsTo(s.models.Users, {as: 'sponsored_by'})

  s.models.Campaigns.belongsTo(s.models.Users, {as: 'user'})
  s.models.Campaigns.belongsTo(s.models.Media, {as: 'media'})
  s.models.Campaigns.belongsTo(s.models.Addresses, {as: 'shopAddress'})

  s.models.Products.belongsTo(s.models.Users, {as: 'user'})
  s.models.Products.belongsTo(s.models.Media, {as: 'media'})
  s.models.Products.belongsTo(s.models.Addresses, {as: 'shopAddress'})

  s.models.Subscriptions.belongsTo(s.models.Users, {as: 'user'})

  s.models.Orders.belongsTo(s.models.Users, {as: 'user'})
  s.models.Orders.hasMany(s.models.Orderable, {as: 'items'})
  s.models.Orders.belongsTo(s.models.Addresses, {as: 'sendFromAddress'})
  s.models.Orders.belongsTo(s.models.Addresses, {as: 'deliverToAddress'})

  s.models.Addresses.belongsTo(s.models.Users, {as: 'user'})
  s.models.Addresses.hasOne(s.models.Orders, {as: 'sendFromAddress'})
  s.models.Addresses.hasOne(s.models.Orders, {as: 'deliverToAddress'})

  s.models.Orderable.belongsTo(s.models.Orders, {as: 'order'})
  s.models.Orderable.belongsTo(s.models.Products, {as: 'product'})

  // s.models.Orderable.sync({force: true})
  // s.models.Addresses.sync({force: true})
  // s.models.Products.sync({force: true})
  // s.models.Campaigns.sync({force: true})

  return {
    Users: s.models.Users,
    Styles: s.models.Styles,
    Threads: s.models.Threads,
    Messages: s.models.Messages,
    Media: s.models.Media,
    Followable: s.models.Followable,
    Sponsorable: s.models.Sponsorable,
    Subscriptions: s.models.Subscriptions,
    Campaigns: s.models.Campaigns,
    Products: s.models.Products,
    Orders: s.models.Orders,
    Orderable: s.models.Orderable,
    Invites: s.models.Invites,
    Addresses: s.models.Addresses
  }
}
