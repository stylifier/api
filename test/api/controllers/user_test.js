'use strict'

require('should')
const request = require('supertest')

describe('validate route', function() {
  let server

  before(function() {
    const appname = require('../../../package').name
    const config = require('rc')(appname, {})
    server = require('../../../app')(config, {
    })
  })

  describe('GET /users', function() {
    it('should get response', function(done) {
      request(server)
      .get('/users')
      .end(function(err, res) {
        res.status.should.eql(200)
        done(err)
      })
    })
  })
})
