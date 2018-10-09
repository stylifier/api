/* eslint-disable camelcase */
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
    from_last_message_at: Datatypes.DATE,
    to_last_message_at: Datatypes.DATE,
    from_last_message_read_at: Datatypes.DATE,
    to_last_message_read_at: Datatypes.DATE,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.findUserThreads = function(username, offset, q) {
    return this.findAll({
      where: {
        [Datatypes.Op.or]: [
          {
            [Datatypes.Op.and]: [
              {fromUsername: username.toLowerCase()},
              {
                toUsername: {
                  [Datatypes.Op.like]: q ? `%${q.toLowerCase()}%` : '%'
                }
              },
            ]
          },
          {
            [Datatypes.Op.and]: [
              {toUsername: username.toLowerCase()},
              {
                fromUsername: {
                  [Datatypes.Op.like]: q ? `%${q.toLowerCase()}%` : '%'
                }
              },
            ]
          },
        ]
      },
      offset: offset,
      limit: 1000,
      attributes: [
        'id',
        'status',
        ['createdAt', 'created_time'],
        'from_last_message_at',
        'to_last_message_at',
        'from_last_message_read_at',
        'to_last_message_read_at',
        'toRating',
        'fromRating'
      ],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: sequelize.models.Users,
          as: 'from',
          attributes: sequelize.models.Users.shortAttributes
        },
        {
          model: sequelize.models.Users,
          as: 'to',
          attributes: sequelize.models.Users.shortAttributes
        }
      ]
    })
    .then(threads =>
      Promise.all(threads.map(thread =>
        sequelize.models.Media.getMediaByThreadId(thread.id)
        .then(m => {
          thread.dataValues.media = m
          return Promise.resolve()
        })))
      .then(() => threads)
    )
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
        from_last_message_at: new Date(),
        is_public: false
      })
    })
  }

  model.getUserRating = function(username) {
    return this.findAll({
      where: {
        [Datatypes.Op.and]: [
          {toUsername: username.toLowerCase()},
          {status: 'CLOSED'},
        ]
      },
      attributes: ['toRating']
    })
    .then(threads => threads.map(t => t.toRating))
    .then(ratings => ({
      ratings: ratings.filter(r => typeof r === 'number'),
      count: ratings.length
    }))
    .then(({count, ratings}) => ({
      rating: Math.round(
        ratings.reduce((a, b) => a + b, 0) * 10 / ratings.length
      ) / 10,
      count: count
    }))
  }

  model.getUserRequestRating = function(username) {
    return this.findAll({
      where: {
        [Datatypes.Op.and]: [
          {toUsername: username.toLowerCase()},
          {
            [Datatypes.Op.or]: [
              {status: 'RATING'},
              {status: 'CLOSED'}
            ]
          }
        ]
      },
      attributes: ['fromRating']
    })
    .then(threads => threads.map(t => t.fromRating))
    .then(ratings => ratings.filter(r => typeof r === 'number'))
    .then(ratings =>
      Math.round(ratings.reduce((a, b) => a + b, 0) * 10 / ratings.length) / 10)
  }

  return model
}
