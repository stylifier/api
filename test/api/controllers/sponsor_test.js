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
    let userUsername
    let sponsorUsername

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
      userUsername = 'test' + (new Date()).getTime()
      createUser(userUsername, false, () => {
        sponsorUsername = 'brand_test' + (new Date()).getTime()
        createUser(sponsorUsername, true, () => done())
      })
    })

    it('ask for sponsorship', function(done) {
      request(server)
      .post(`/users/${sponsorUsername}/sponsor`)
      .send({})
      .set('Accept', 'application/json')
      .set('X-Consumer-Username', userUsername)
      .end(function(err, res) {
        res.status.should.eql(200)
        should.exists(res.body.success)
        done(err)
      })
    })

    describe('ask for sponsorship and', function() {
      beforeEach(function(done) {
        request(server)
        .post(`/users/${sponsorUsername}/sponsor`)
        .send({})
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', userUsername)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.success)
          done(err)
        })
      })

      it.only('brands accepts', function(done) {
        request(server)
        .post(`/users/${userUsername}/sponsor`)
        .set('Accept', 'application/json')
        .send({accept: true})
        .set('X-Consumer-Username', sponsorUsername)
        .end(function(err, res) {
          res.status.should.eql(200)
          done(err)
        })
      })

      it.only('brands accepts and get brand sponsored by', function(done) {
        request(server)
        .post(`/users/${userUsername}/sponsor`)
        .set('Accept', 'application/json')
        .send({accept: true})
        .set('X-Consumer-Username', sponsorUsername)
        .end(function(err, res) {
          request(server)
          .get(`/users/${sponsorUsername}/sponsored_by`)
          .set('Accept', 'application/json')
          .set('X-Consumer-Username', sponsorUsername)
          .end(function(err, res) {
            res.body.data.length.should.eql(1)
            res.status.should.eql(200)
            done(err)
          })
        })
      })

      it.only('brands accepts and get user sponsors', function(done) {
        request(server)
        .post(`/users/${userUsername}/sponsor`)
        .set('Accept', 'application/json')
        .send({accept: true})
        .set('X-Consumer-Username', sponsorUsername)
        .end(function(err, res) {
          request(server)
          .get(`/users/${userUsername}/sponsors`)
          .set('Accept', 'application/json')
          .set('X-Consumer-Username', userUsername)
          .end(function(err, res) {
            res.body.data.length.should.eql(1)
            res.status.should.eql(200)
            done(err)
          })
        })
      })

      it.only('brands rejects', function(done) {
        request(server)
        .post(`/users/${userUsername}/sponsor`)
        .set('Accept', 'application/json')
        .send({accept: false})
        .set('X-Consumer-Username', sponsorUsername)
        .end(function(err, res) {
          res.status.should.eql(200)
          done(err)
        })
      })
    })
  })
})
