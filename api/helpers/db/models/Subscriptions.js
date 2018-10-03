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

  model.createInstance = function(username, subscriptionId, name) {
    return this.findOne({where: {id: subscriptionId}})
    .then(subscription => subscription ?
      subscription.update({userUsername: username}) :
      this.create({
        id: subscriptionId,
        name: name,
        userUsername: username.toLowerCase()
      })
    )
  }

  model.getUsersSubscriptions = function(username) {
    return this.findAll({
      where: {userUsername: username.toLowerCase()},
      attributes: ['id', 'name']
    }).then(r => r.map(t => ({id: t.id, name: t.name})))
  }

  model.deleteInstance = function(username, subscriptionId) {
    return this.findOne({
      where: {
        id: subscriptionId,
        userUsername: username.toLowerCase()
      }
    })
    .then(subscription => subscription && subscription.destroy())
  }

  return model
}
