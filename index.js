'use strict'

const appname = require('./package').name
const config = require('rc')(appname, {})
const logger = console

const AWS = require('aws-sdk')

const s3 = new AWS.S3()
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

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

const mailer = config.mockMailer ?
  require('./api/mocks/mailer')(config.mailer, db) :
  require('./api/helpers/mailer')(config.mailer, db)

const notifications = config.mockNotifications ?
  require('./api/mocks/notifications')(
    config.notifications, db, oneSignal, mailer) :
  require('./api/helpers/notifications')(
    config.notifications, db, oneSignal, mailer)

const server = require('./app')(config, {
  logger,
  db,
  notifications,
  oneSignal,
  s3,
  mailer,
  instagram: instagramAPI,
  kong: kong(config),
  id: require('uniqid'),
  jwt: require('jwt-simple'),
})
server.listen(config.appPort)
logger.info('server has started on port ' + config.appPort)
