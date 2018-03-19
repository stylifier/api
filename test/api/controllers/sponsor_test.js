/* eslint-disable camelcase */
'use strict'

const should = require('should')
const request = require('supertest')

describe('sponsor route', function() {
  let server

  before(function() {
    const appname = require('../../../package').name
    const config = require('rc')(appname, {})
    server = require('../app')(config)
  })

  describe('creates a user and', function() {
    const password = '12345678'
    let usernameFrom
    let usernameTo

    const createUser = (user, isBrand, cb) => {
      request(server)
      .post('/register')
      .send({
        full_name: 'test',
        username: user,
        email: 'test@mail.com',
        is_brand: isBrand,
        password: password,
      })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        cb(err)
      })
    }

    beforeEach(function(done) {
      usernameFrom = 'test' + (new Date()).getTime()
      createUser(usernameFrom, false, () => {
        usernameTo = 'test' + (new Date()).getTime()
        createUser(usernameTo, true, () => done())
      })
    })

    it('ask for sponsorship', function(done) {
      request(server)
      .post(`/users/${usernameTo}/sponsor`)
      .send({})
      .set('Accept', 'application/json')
      .set('X-Consumer-Username', usernameFrom)
      .end(function(err, res) {
        res.status.should.eql(200)
        should.exists(res.body.success)
        done(err)
      })
    })

    describe('ask for sponsorship and', function() {
      beforeEach(function(done) {
        request(server)
        .post(`/users/${usernameTo}/sponsor`)
        .send({})
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.success)
          done(err)
        })
      })

      it.only('brands accepts', function(done) {
        request(server)
        .post(`/users/${usernameFrom}/sponsor`)
        .set('Accept', 'application/json')
        .send({accept: true})
        .set('X-Consumer-Username', usernameTo)
        .end(function(err, res) {
          res.status.should.eql(200)
          done(err)
        })
      })

      it.only('brands rejects', function(done) {
        request(server)
        .post(`/users/${usernameFrom}/sponsor`)
        .set('Accept', 'application/json')
        .send({accept: false})
        .set('X-Consumer-Username', usernameTo)
        .end(function(err, res) {
          res.status.should.eql(200)
          done(err)
        })
      })
    })
  })
})
