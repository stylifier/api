'use strict'
const rp = require('request-promise')
const jwt = require('jwt-simple')

module.exports = (config) => {
  return {
    createUser: (username, id) => 
      Promise.resolve({ 
        custom_id: '7ggvp6zjc3sb2ko',
        created_at: 1515269450000,
        username: 'ali1515269450182',
        id: '84044533-1df1-48ef-8feb-43ea4ba76dc5' }),
    createJWT: (username) => 
      Promise.resolve({ 
        created_at: 1515249478000,
        id: 'd3927c98-57cc-4a02-b63b-6508bc97052e',
        algorithm: 'HS256',
        key: 'BE4cthk5otwaR4fU1jKNZtt7vMwS8hQ7',
        secret: 'BlZEUVVmdw26eAEISYIwMj3T4SSyeQ95',
        consumer_id: '840ffb7b-9f18-4f18-8a49-4dfecce5d9cf'
      }).then((r) => {
        return {jwt: jwt.encode({iss: r.key}, r.secret, r.algorithm)}
      })
  }
}