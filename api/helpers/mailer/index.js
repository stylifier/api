'use strict'
const AWS = require('aws-sdk')
const templates = require('./templates')

module.exports = (config, db) => {
  AWS.config.update({region: 'eu-west-1'})
  const ses = new AWS.SES({apiVersion: '2010-12-01'})

  return {
    send: opts => {
      const params = {
        Destination: {
          ToAddresses: [opts.email]
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: templates.formatBody(opts.body)
                .replace(/__SWB__/g, config.websiteURL)
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: opts.subject
          }
        },
        Source: config.admin,
        ReplyToAddresses: [config.admin],
      }
      if (opts.sendCopyToAdmin)
        params.Destination.BccAddresses = [config.admin]

      if (!opts.email)
        params.Destination.ToAddresses = [config.admin]

      return ses.sendEmail(params).promise()
    },
    templates
  }
}
