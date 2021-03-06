/* eslint-disable camelcase */
'use strict'

const should = require('should')
const request = require('supertest')

describe('validate route', function() {
  let server

  before(function() {
    const appname = require('../../../package').name
    const config = require('rc')(appname, {})
    server = require('../app')(config)
  })

  describe('creates a user and thread', function() {
    const password = '12345678'
    let usernameFrom
    let usernameTo
    let threadId

    const createUser = (user, cb) => {
      request(server)
      .post('/register')
      .send({
        full_name: 'test',
        username: user,
        email: 'test@mail.com',
        password: password,
      })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        cb(err)
      })
    }

    const createThread = cb => {
      request(server)
      .post('/threads')
      .send({to: {username: usernameTo}})
      .set('Accept', 'application/json')
      .set('X-Consumer-Username', usernameFrom)
      .end(function(err, res) {
        res.status.should.eql(200)
        should.exists(res.body.success)
        threadId = res.body.id
        cb(err)
      })
    }

    beforeEach(function(done) {
      usernameFrom = 'test' + (new Date()).getTime()
      createUser(usernameFrom, () => {
        usernameTo = 'test' + (new Date()).getTime()
        createUser(usernameTo, () => createThread(() => done()))
      })
    })

    it('create a message', function(done) {
      request(server)
      .put(`/threads/${threadId}/messages`)
      .send({text: 'asd'})
      .set('Accept', 'application/json')
      .set('X-Consumer-Username', usernameFrom)
      .end(function(err, res) {
        res.status.should.eql(200)
        should.exists(res.body.success)
        done(err)
      })
    })

    describe('creates a message and', function() {
      beforeEach(function(done) {
        request(server)
        .put(`/threads/${threadId}/messages`)
        .send({text: 'asd'})
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.success)
          done(err)
        })
      })

      it('create a message', function(done) {
        request(server)
        .get(`/threads/${threadId}/messages`)
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          done(err)
        })
      })
    })

    describe('open thread and', function() {
      beforeEach(function(done) {
        request(server)
        .put(`/threads/${threadId}/messages`)
        .send({text: 'asd'})
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameTo)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.success)
          done(err)
        })
      })

      it('close thread', function(done) {
        request(server)
        .post(`/threads/${threadId}/close`)
        .send({rating: 4, review: 'test review'})
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end((err, res) => {
          if (err) return done(err)
          request(server)
          .get(`/users/${usernameFrom}`)
          .end((err, res) => {
            done(err)
          })
        })
      })
    })
  })
})
