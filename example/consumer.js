const amqp = require('../')
const QUEUE = process.argv[2]
const {consume} = amqp('amqp://localhost')
console.log(`listening on |${QUEUE}|`)
consume(QUEUE, (msg) => console.log(msg.content.toString()))
