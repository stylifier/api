'use strict'
const hooks = require('hooks')
const UUIDregex = /\S{8}-\S{4}-\S{4}-\S{4}-\S{12}/
const topicNameRegex = /&topic=.+?(?=&)/
const failUserId = '63ce7877-a836-4099-a863-38639d02b089'
const falsetopicName = '%2Fv1%2Ffb374cfa-5fcc-4421-a7c0-858152549156'

hooks.before('/users > GET > 403 > text/plain; charset=utf-8', function(transaction, done) {
  transaction.skip = false
  transaction.request.uri = transaction.request.uri.replace(UUIDregex, failUserId)
  transaction.fullPath = transaction.fullPath.replace(UUIDregex, failUserId)
  done()
})

hooks.before('/users > GET > 403 > text/plain; charset=utf-8', function(transaction, done) {
  transaction.skip = false
  transaction.request.uri = transaction.request.uri.replace(topicNameRegex, '&topic=' + falsetopicName)
  transaction.fullPath = transaction.fullPath.replace(topicNameRegex, '&topic=' + falsetopicName)
  done()
})
