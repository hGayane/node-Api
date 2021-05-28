const io = require('../socket/socket');
const amqp = require('amqplib/callback_api');
const Restaurant = require('../models/restaurantModel');


function consumeupdateRestaurant(channel) {
    var queue = 'updateRestaurant';
    channel.assertQueue(queue, {
        durable: true
    });

    channel.consume(queue, (data) => {
        const restaurantData = JSON.parse(data.content.toString());
        const restaurant = new Restaurant(restaurantData);
        console.log(`Received restaurants: ${restaurant.name}`);
        //save in db
        restaurant.save();
        //Socket Trigger All Clients
        io.socket.emit(queue, restaurantData);
    },
        {
            noAck: true
        });
}
function consumeUpdateRestaurantById(channel) {
    var queue = 'updateRestaurantById';
    channel.assertQueue(queue, {
        durable: true
    });

    channel.consume(queue, (data) => {
        const restaurantData = JSON.parse(data.content.toString());
        const restaurant = new Restaurant(restaurantData);
        console.log(`Received restaurant by Id: ${restaurant.name}`);
        //save in db
        restaurant.save();
        //Socket Trigger All Clients
        io.socket.emit(queue, restaurantData);
    },
        {
            noAck: true
        });
}
function consumeUpdateRestaurantFieldsById(channel){
    var queue = 'updateRestaurantFieldsById';
    channel.assertQueue(queue, {
      durable: true
    });

    channel.consume(queue, (data) => {
      const restaurantData = JSON.parse(data.content.toString());
      const restaurant = new Restaurant(restaurantData);
      console.log(`Received restaurant fields by Id: ${restaurant.name}`);
      //save in db
      restaurant.save();
      //Socket Trigger All Clients
      io.socket.emit(queue, restaurantData);
    },
      {
        noAck: true
      });
}
function consumeRemoveRestaurantById(channel){
    var queue = 'removeRestaurantById';
    channel.assertQueue(queue, {
      durable: true
    });

    channel.consume(queue, (data) => {
      const restaurantData = JSON.parse(data.content.toString());
      const restaurant = new Restaurant(restaurantData);
      console.log(`Removed restaurant  by Id: ${restaurant.name}`);
      //remove
      restaurant.remove();
      //Socket Trigger All Clients
      io.socket.emit(queue, restaurantData);
    },
      {
        noAck: true
      });
}

function consumeRestaurant() {
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            consumeupdateRestaurant(channel);
            consumeUpdateRestaurantById(channel);
            consumeUpdateRestaurantFieldsById(channel);
        })
    });
}
module.exports = consumeRestaurant;

