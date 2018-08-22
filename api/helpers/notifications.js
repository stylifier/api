'use strict'

module.exports = (config, db, oneSignal, mailer) => {
  const {Subscriptions, Users} = db

  return {
    send: opts => {
      const {username, subject, url} = opts
      return Subscriptions.getUsersSubscriptions(username)
      .then(ids => subject && ids.length > 0 ?
        oneSignal.send(ids, subject, url || '/') : Promise.resolve())
      .then(() => opts.body ?
        Users.findUserByUsername(username, true) :
        Promise.resolve({}))
      .then(user => user.email && opts.body ?
        mailer.send({
          email: user.email,
          body: opts.body,
          subject: opts.subject,
          sendCopyToAdmin: opts.sendCopyToAdmin
        }) : Promise.resolve({}))
      .catch(e => {
        console.log(e)
        return Promise.resolve()
      })
    },
    emailAdmin: opts =>
      mailer.send({
        body: opts.body,
        subject: opts.subject
      })
      .catch(e => {
        console.log(e)
        return Promise.resolve()
      })
  }
}
