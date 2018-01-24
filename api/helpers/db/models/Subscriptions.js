'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('subscriptions', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    name: {
      type: Datatypes.STRING,
      primaryKey: true
    }
  })

  model.createInstance = function(username, subscriptionId) {
    return this.findOne({where: {id: subscriptionId}})
    .then(subscription => subscription ?
      subscription.update({userUsername: username}) :
      this.create({
        id: subscriptionId,
        name: 'OneSignal',
        userUsername: username.toLowerCase()
      })
    )
  }

  model.getUsersSubscriptions = function(username) {
    return this.findAll({
      where: {userUsername: username.toLowerCase()},
      attributes: ['id']
    }).then(r => r.map(t => t.id))
  }

  model.deleteInstance = function(username, subscriptionId) {
    return this.findOne({
      where: {
        id: subscriptionId,
        name: 'OneSignal',
        userUsername: username.toLowerCase()
      }
    })
    .then(subscription => subscription && subscription.destroy())
  }

  return model
}
