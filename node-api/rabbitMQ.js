const amqp = require('amqplib');
const _ = require('lodash');

let instance;

class MessageBroker {

  constructor() {
    this.queues = {}
  }

  async init() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await this.connection.createChannel();
    return this
  }

  /**
   * Send message to queue
   * queue Queue name
   * msg Message as Buffer
   */
  async send(queue, msg) {
    if (!this.connection) {
      await this.init();
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, msg)
  }

  /**
   * queue Queue name
   * handler Handler that will be invoked with given message and acknowledge function (msg, ack)
   */
  async subscribe(queue, handler) {
    if (!this.connection) {
      await this.init();
    }
    if (this.queues[queue]) {
      const existingHandler = _.find(this.queues[queue], h => h === handler)
      if (existingHandler) {
        return () => this.unsubscribe(queue, existingHandler)
      }
      this.queues[queue].push(handler)
      return () => this.unsubscribe(queue, handler)
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.queues[queue] = [handler]
    this.channel.consume(
      queue,
      async (msg) => {
        const ack = _.once(() => this.channel.ack(msg))
        this.queues[queue].forEach(h => h(msg, ack))
      }
    );
    return () => this.unsubscribe(queue, handler)
  }

  async unsubscribe(queue, handler) {
    _.pull(this.queues[queue], handler)
  }
}


MessageBroker.getInstance = async function () {
  if (!instance) {
    const broker = new MessageBroker();
    instance = broker.init()
  }
  return instance;
};

module.exports = MessageBroker;
