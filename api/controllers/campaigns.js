'use strict'

module.exports = function(dependencies) {
  const Campaigns = dependencies.db.Campaigns

  return {
    createCampaign: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const mediaId = req.swagger.params.body.value.media.id
      const location = req.swagger.params.body.value.location
      const description = req.swagger.params.body.value.description

      Campaigns.createInstance(username, mediaId, location, description)
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getCampaigns: function(req, res, next) {
      // const username = req.headers['x-consumer-username']

      Campaigns.getCampaigns()
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    getSelfCampaigns: function(req, res, next) {
      const username = req.headers['x-consumer-username']

      Campaigns.getSelfCampaigns(username)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    }
  }
}
