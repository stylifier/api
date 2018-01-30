'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('threads', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    status: Datatypes.STRING,
    fromReview: Datatypes.TEXT,
    fromRating: Datatypes.DOUBLE,
    toReview: Datatypes.TEXT,
    toRating: Datatypes.DOUBLE,
    is_public: Datatypes.BOOLEAN,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.findUserThreads = function(username, offset) {
    return this.findAll({
      where: {
        [Datatypes.Op.or]: [
          {fromUsername: username.toLowerCase()},
          {toUsername: username.toLowerCase()}
        ]
      },
      offset: offset,
      limit: 1000,
      attributes: ['id', 'status', ['createdAt', 'created_time']],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: sequelize.models.Users,
          as: 'from',
          attributes: sequelize.models.shortAttributes
        },
        {
          model: sequelize.models.Users,
          as: 'to',
          attributes: sequelize.models.shortAttributes
        }
      ]
    })
  }

  model.getThreadById = function(id) {
    return this.findOne({
      where: {
        id: id
      }
    })
  }

  model.createInstance = function(from, to) {
    return this.findAll({
      where: {
        [Datatypes.Op.and]: [
          {fromUsername: from.toLowerCase()},
          {toUsername: to.toLowerCase()},
          {
            [Datatypes.Op.or]: [
              {status: 'REQUESTED'},
              {status: 'OPENED'}
            ]
          }
        ]
      }
    })
    .then(r => {
      if (r.length > 0)
        return Object.assign({isNotCreated: true}, r[0])

      return this.create({
        id: id(),
        status: 'REQUESTED',
        fromUsername: from.toLowerCase(),
        toUsername: to.toLowerCase(),
        is_public: false
      })
    })
  }

  return model
}
