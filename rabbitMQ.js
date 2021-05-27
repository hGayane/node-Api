const amqp = require('amqplib/callback_api');

const rabbitUrl = 'amqp://localhost';

const sendRabbitMQ = function sendRabbitMQ(queueName, data) {
  amqp.connect(rabbitUrl, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      var queue = queueName;
      channel.assertQueue(queue, {
        durable: true
      });
      channel.sendToQueue(queue, Buffer.from(data));
      console.log(`Sent ${data}`);
    });

    setTimeout(function () {
      connection.close();
      //process.exit(0);
    }, 500);
  });
}
module.exports = sendRabbitMQ;