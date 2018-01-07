'use strict'

const appname = require('./package').name
const config = require('rc')(appname, {})
const logger = console
const db = config.mockbackend ?
  require('./api/mocks/db') :
  require('./api/helpers/db')
  
  const kong = config.mockkong ?
    require('./api/mocks/kong') :
    require('./api/helpers/kong')

const server = require('./app')(config, {
  logger,
  db: db,
  kong: kong(config),
  id: require('uniqid'),
  bcrypt: require('bcrypt'),
  jwt: require('jwt-simple')
})
server.listen(config.appPort)
logger.info('server has started on port ' + config.appPort)
