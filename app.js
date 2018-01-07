'use strict'

module.exports = function(config, deps) {
  const app = require('express')()
  const SwaggerExpress = require('swagger-express-mw')
  const multer = require('multer')
  const AWS = require('aws-sdk')
  
  deps.s3 = new AWS.S3();
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  app.use('/media', multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 52428800 },
  }).single('qqfile'))

  // in fittings/swagger-router this dependencies will enject into controllers
  config.dependencies = deps

  SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) {
      deps.logger.error(err)
      throw err
    }

    // install middleware
    swaggerExpress.register(app)
  })
  return app
}
