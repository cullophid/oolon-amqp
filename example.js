const amqp = require('./')
const hl = require('highland')

const {consume, sendToQueue} = amqp('amqp://localhost')

consume('TEST', (msg) => console.log(msg))

hl(process.stdin).each((buffer) => {
  sendToQueue('TEST', buffer)
})
