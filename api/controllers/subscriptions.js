'use strict'

module.exports = function(dependencies) {
  const {Subscriptions} = dependencies.db

  return {
    createSubscription: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const subscriptionId = req.swagger.params.subscription_id.value

      Subscriptions.createInstance(username, subscriptionId)
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    deleteSubscription: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const subscriptionId = req.swagger.params.subscription_id.value

      Subscriptions.deleteInstance(username, subscriptionId)
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    }
  }
}
