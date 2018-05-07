'use strict'

module.exports = {
  development: {
    database: 'stylifier',
    username: process.env.api_db__username || 'test',
    password: process.env.api_db__password || 'test',
    host: process.env.api_db__host || 'localhost',
    port: process.env.api_db__port || '5432',
    dialect: 'postgres'
  },
  test: {
    database: 'stylifier',
    username: process.env.api_db__username || 'test',
    password: process.env.api_db__password || 'test',
    host: process.env.api_db__host || 'localhost',
    port: process.env.api_db__port || '5432',
    dialect: 'postgres'
  },
  production: {
    database: 'stylifier',
    username: process.env.api_db__username || 'test',
    password: process.env.api_db__password || 'test',
    host: process.env.api_db__host || 'localhost',
    port: process.env.api_db__port || '5432',
    dialect: 'postgres'
  }
}
