'use strict'

const appname = require('./package').name
const config = require('rc')(appname, {})
const logger = console
const ExternalService = config.mockbackend ?
  require('./api/mocks/ExternalService') :
  require('./api/helpers/ExternalService')

const server = require('./app')(config, {
  logger,
  ExternalService: new ExternalService(config)
})
server.listen(config.appPort)
logger.info('server has started on port ' + config.appPort)
