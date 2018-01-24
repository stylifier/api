'use strict'

const appname = require('./package').name
const config = require('rc')(appname, {})
const logger = console
const db = config.mockBackend ?
  require('./api/mocks/db')(config.db) :
  require('./api/helpers/db')(config.db)

const kong = config.mockKong ?
  require('./api/mocks/kong') :
  require('./api/helpers/kong')

const oneSignal = config.mockOneSignal ?
  require('./api/mocks/oneSignal')(config.oneSignal) :
  require('./api/helpers/oneSignal')(config.oneSignal)

const instagramAPI = config.mockInstagramAPI ?
  require('./api/mocks/instagramAPI')(config.instagram) :
  require('./api/helpers/instagramAPI')(config.instagram)

const server = require('./app')(config, {
  logger,
  db: db,
  instagram: instagramAPI,
  kong: kong(config),
  id: require('uniqid'),
  jwt: require('jwt-simple'),
  oneSignal: oneSignal
})
server.listen(config.appPort)
logger.info('server has started on port ' + config.appPort)
