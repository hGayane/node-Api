const io = require('../socket/socket');
const amqp = require('amqplib/callback_api');

function restConsumer(Restaurant) {
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            var queue = 'updateRestaurant';

            channel.assertQueue(queue, {
                durable: true
            });

            //console.log(`Waiting for restaurant messages in ${queue}. To exit press CTRL+C`);

            channel.consume(queue, (data) => {
                const restaurantData = JSON.parse(data.content.toString());
                const restaurant = new Restaurant(restaurantData);
                console.log(`Received restaurants: ${restaurant.name}`);
                //save in db
                restaurant.save();
                //Socket Trigger All Clients
                io.socket.emit("updateRestaurant", restaurantData);
            },  
                {
                    noAck: true
                });
        });
    });
}
module.exports = restConsumer;
