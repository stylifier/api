'use strict'

module.exports = function(dependencies) {
  const {db, notifications, mailer} = dependencies
  const {Orders, Orderable} = db

  return {
    addOrder: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const product = req.swagger.params.body.value

      Orders.getOpenOrders(username)
      .then(orders => {
        let sameAddressOrders = orders ? orders.filter(order =>
          order.items.filter(item =>
            item.product.shopAddressId === product.shopAddressId)
          .length > 0) : []

        if (sameAddressOrders.length === 0)
          sameAddressOrders = orders ? orders.filter(order =>
            !order.items || order.items.length === 0) : []

        return sameAddressOrders.length > 0 ?
          sameAddressOrders[0] :
          Orders.createInstance(username)
      })
      .then(order =>
        Orderable.createInstance({orderId: order.id, productId: product.id})
        .then(orderable => order.addItem(orderable))
      )
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    getOrders: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const status = req.swagger.params.status.value

      Orders.getOrders(username, status)
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    closeOrder: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const addressId = req.swagger.params.body.value.id
      const orderId = req.swagger.params.id.value

      Orders.getOrderById(username, orderId)
      .then(order => order.update({
        deliverToAddressId: addressId,
        sendFromAddressId: order.items[0].product.shopAddressId
      }))
      .then(() => Orders.setStatus(username, orderId, 'ORDERED'))
      .then(order =>
        notifications.send({
          username: order.sendFromAddress.userUsername,
          subject: mailer.templates.createOrderSubject(
            order.sendFromAddress.userUsername, username, 'ORDERED'),
          url: 'orders',
          sendCopyToAdmin: true,
          body: mailer.templates.createOrderBody(
            order.sendFromAddress.userUsername, username, 'ORDERED')
        }))
      .then(r => {
        res.json(r)
        next()
      })
      .catch(e => next(e))
    },
    setOrderStatus: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const orderId = req.swagger.params.id.value
      const status = req.swagger.params.status.value

      Orders.setStatus(username, orderId, status)
      .then(order => notifications.send({
        username: order.user.username,
        subject: mailer.templates.createOrderSubject(
          order.sendFromAddress.userUsername, order.user.username, status),
        url: 'orders',
        sendCopyToAdmin: true,
        body: mailer.templates.createOrderBody(
          order.sendFromAddress.userUsername, order.user.username, status)
      }))
      .then(() => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    },
    deleteOrderItem: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const id = req.swagger.params.id.value

      Orderable.getOrderItem({id: id})
      .then(r =>
        r.order.userUsername.toLowerCase() === username.toLowerCase() ?
          r.destroy() :
          Promise.reject('order item does not belong to user'))
      .then(r => Orders.getOpenOrders(username))
      .then(orders =>
        Promise.all(
          orders.map(order =>
            order.items.length === 0 ?
            order.destroy() :
            Promise.resolve()
          )
        )
      )
      .then(() => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    }
  }
}
