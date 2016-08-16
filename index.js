const amqp = require('amqplib')
const curry = require('lodash.curry')
const CHANNEL_OPTIONS = {durable: true}
const QUEUE_OPTIONS = {persistant: true}

const connect = (url) => {
  return amqp.connect(url)
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.on('error', (err) => console.error(err.stack || err))
      return ch
    })
}

const consume = curry((url, queue, handler) => {
  return connect(url)
      .then((ch) => {
        ch.assertQueue(queue, CHANNEL_OPTIONS)
        ch.consume(queue, (msg) => {
          Promise.resolve(msg)
            .then(handler)
            .then(() => ch.ack(msg))
            .catch((err) => {
              console.error(err.stack || err)
              ch.nack()
            })
        })
      })
})

const sendToQueue = curry((url, queue, buffer) => {
  return connect(url)
    .then((ch) => {
      ch.assertQueue(queue, CHANNEL_OPTIONS)
      ch.on('error', (err) => console.error(err.stack || err))
      ch.sendToQueue('TEST', buffer, QUEUE_OPTIONS)
      return buffer
    })
})

module.exports = (url) => {
  return {
    consume: consume(url),
    sendToQueue: sendToQueue(url)
  }
}
