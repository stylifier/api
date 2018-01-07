'use strict'

module.exports = function(dependencies) {
  const Threads = dependencies.db.Threads
  const Messages = dependencies.db.Messages
  const Media = dependencies.db.Media
  const Op = dependencies.db.Op
  const id = dependencies.id
  const kong = dependencies.kong
  
  return {
    getMessages: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const offset = req.swagger.params.pagination.value || 0
      const threadId = req.swagger.params.thread_id.value
      
      Messages.findAll({
        where: {threadId: threadId},
        offset: offset, 
        limit: 20,
        attributes: ['id', 'text', ['threadId', 'thread_id'],'status', ['createdAt', 'created_time']],
        include: [{
          model: Media,
          as: 'media'
        }]
      })
      .then(r => {
        res.json({data: r, pagination: offset + r.length})
        next()
      })
      .catch(e => next(e))
    },
    createMessage: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const body = req.swagger.params.body.value
      
      Messages.create({
        id: id(),
        senderUsername: username,
        status: 'SENT',
        threadId: req.swagger.params.thread_id.value,
        text: body.text
      })
      .then(msg => msg.addMedia(body.media))
      .then(msg => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    }
  }
}