'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('messages', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    text: Datatypes.TEXT,
    status: Datatypes.STRING,
    senderUsername: Datatypes.STRING,
    createdAt: Datatypes.DATE,
    updatedAt: Datatypes.DATE
  })

  model.getThreadMessages = function(threadId, offset) {
    return this.findAll({
      where: {threadId: threadId},
      offset: offset,
      limit: 20,
      order: [['createdAt', 'DESC']],
      attributes: [
        'senderUsername',
        'id',
        'text',
        ['threadId', 'thread_id'],
        'status',
        ['createdAt', 'created_time']
      ],
      include: [{
        model: sequelize.models.Media,
        as: 'media'
      }]
    })
  }

  model.createInstance = function(username, threadId, text) {
    return this.create({
      id: id(),
      senderUsername: username.toLowerCase(),
      status: 'SENT',
      threadId: threadId,
      text: text
    })
  }

  return model
}
