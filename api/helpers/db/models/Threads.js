'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('threads', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    status: Datatypes.STRING,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.findUserThreads = function(username, offset) {
    return this.findAll({
      where: {
        [Datatypes.Op.or]: [
          {fromUsername: username},
          {toUsername: username}
        ]
      },
      offset: offset,
      limit: 20,
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

  model.createInstance = function(from, to) {
    return this.create({
      id: id(),
      status: 'REQUESTED',
      fromUsername: from,
      toUsername: to,
    })
  }

  return model
}
