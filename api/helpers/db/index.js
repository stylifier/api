'use strict'
const models = require('./models')

const Sequelize = require('sequelize')
const sequelize = new Sequelize('stylifier', 'test', 'test', {
  host: 'localhost',
  port: 32769,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
})

// sequelize.sync({force: true})

module.exports = models(sequelize, Sequelize)
