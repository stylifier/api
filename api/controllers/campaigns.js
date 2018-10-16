'use strict'

module.exports = function(dependencies) {
  const {notifications, db} = dependencies
  const {Campaigns, Media} = db

  return {
    createCampaign: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const {media, shopAddress, description} = req.swagger.params.body.value

      Campaigns.createInstance(username, media.id, description, shopAddress.id)
      .then(() => Media.getMediaById(media.id))
      .then(m => notifications.emailAdmin({
        subject: `${username.replace('m_g_i_o_s_', '')} has requested creating a campaign`,
        body: `<img src="${m.images.standard_resolution.url}">
        <h3>${description}</h3>
        <h4>${username}</h4>`
      }))
      .then(() => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getCampaigns: function(req, res, next) {
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
