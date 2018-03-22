'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('sponsors', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    status: Datatypes.STRING,
    plan: Datatypes.STRING,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.createInstance = function(sponsor, sponsoredBy, accept) {
    return this.findOne({where: {
      sponsorUsername: sponsoredBy.toLowerCase(),
      sponsoredByUsername: sponsor.toLowerCase()
    }})
    .then(s => {
      if (!s)
        return this.findOne({where: {
          sponsorUsername: sponsor.toLowerCase(),
          sponsoredByUsername: sponsoredBy.toLowerCase()
        }})
        .then(t => {
          if (!t)
            return this.create({
              id: id(),
              sponsorUsername: sponsor.toLowerCase(),
              sponsoredByUsername: sponsoredBy.toLowerCase(),
              status: 'REQUESTED'
            })

          return t.update({status: 'REQUESTED'})
        })

      return s.update({status: accept ? 'ACCEPTED' : 'REJECTED'})
    })
  }

  model.getUsersSponsoredBy = function(username, offset, quary, limit) {
    return this.findAll({
      where: Object.assign({
        sponsorUsername: username.toLowerCase(),
        status: {
          [Datatypes.Op.or]: ['REQUESTED', 'ACCEPTED']
        }
      }, quary ? {sponsoredByUsername: {[Datatypes.Op.like]: `${quary}`}} : {}),
      attributes: ['status', 'plan'],
      include: [{
        model: sequelize.models.Users,
        as: 'sponsored_by',
        attributes: sequelize.models.Users.shortAttributes
      }],
      offset: offset,
      limit: limit || 20
    })
  }

  model.getUserSponsors = function(username, offset, quary, limit) {
    return this.findAll({
      where: Object.assign({
        sponsoredByUsername: username.toLowerCase(),
        status: {
          [Datatypes.Op.or]: ['REQUESTED', 'ACCEPTED']
        }
      },
        quary ? {sponsorUsername: {[Datatypes.Op.like]: `${quary}`}} : {}),
      attributes: ['status', 'plan'],
      include: [{
        model: sequelize.models.Users,
        as: 'sponsor',
        attributes: sequelize.models.Users.shortAttributes
      }],
      offset: offset,
      limit: limit || 20
    })
  }

  return model
}
