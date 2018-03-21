'use strict'

module.exports = function(dependencies) {
  const Sponsorable = dependencies.db.Sponsorable

  return {
    createSponsor: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const sponsor = req.swagger.params.username.value
      const body = req.swagger.params.body.value

      Sponsorable.createInstance(sponsor, username, body.accept)
      .then(() => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getUsersSponsors: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']
      const query = req.swagger.params.q.value

      Sponsorable.getUserSponsors(username, offset, query)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    getUsersSponsoredBy: function(req, res, next) {
      const offset = req.swagger.params.pagination.value || 0
      const username = req.headers['x-consumer-username']
      const query = req.swagger.params.q.value

      Sponsorable.getUsersSponsoredBy(username, offset, query)
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    }
  }
}
