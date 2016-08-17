const hl = require('highland')
const amqp = require('../')

const {sendToQueue} = amqp('amqp://localhost')


const QUEUE = process.argv[2]


console.log('producing on:', QUEUE)
hl(process.stdin).each((buffer) => {
  const path  = buffer.toString().replace('\n', '')
  console.log('PATH: ', path)
  const data = JSON.stringify({path})
  sendToQueue(QUEUE, new Buffer(data))
    .catch((err) => console.error(err.stack || err))
})
