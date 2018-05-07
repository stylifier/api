'use strict'

module.exports = function(config, deps) {
  const app = require('express')()
  const SwaggerExpress = require('swagger-express-mw')
  const multer = require('multer')

  app.use('/media', multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 52428800},
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
