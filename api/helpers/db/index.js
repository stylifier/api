'use strict'
const models = require('./models')

const Sequelize = require('sequelize')

module.exports = function(config) {
  const sequelize = new Sequelize(config.name, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
  })

  sequelize.sync()

  return models(sequelize, Sequelize)
}
