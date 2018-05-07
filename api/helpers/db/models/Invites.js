/* eslint-disable camelcase */
'use strict'
const id = require('uniqid')

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('invites', {
    id: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    is_brand: {
      type: Datatypes.BOOLEAN,
      defaultValue: false
    },
    is_used: {
      type: Datatypes.BOOLEAN,
      defaultValue: false
    }
  })

  model.useInviteCode = function(inviteCode) {
    this.count({where: {is_used: false}})
    .then(count => {
      if (count < 10) {
        this.create({id: id(), is_brand: false})
        this.create({id: id(), is_brand: true})
      }
    })
    .catch(e => console.log(e))

    if (!inviteCode)
      return Promise.reject(Object.assign(
        new Error('INVITE_CODE_NOT_VALID'),
        {statusCode: 403}))

    return this.findOne({
      where: {id: inviteCode.toLowerCase(), is_used: false}
    }).then(invite => {
      if (!invite)
        return Promise.reject(Object.assign(
          new Error('INVITE_CODE_NOT_VALID'),
          {statusCode: 403}))

      return invite
    })
  }

  return model
}
