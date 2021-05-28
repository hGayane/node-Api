const io = require('../socket/socket');
const Restaurant = require('../models/restaurantModel');
const RabbitMQ = require('../rabbitMQ');

function consumeRestaurant() {
  RabbitMQ.getInstance()
    .then(broker => {

      broker.subscribe('updateRestaurant', (msg, ack) => {

        const restaurantData = JSON.parse(msg.content.toString());
        const restaurant = new Restaurant(restaurantData);
        console.log(`Receiving restaurants: ${restaurant.name}`);
        try {
          //save in db
          restaurant.save().then(() => {
            console.log(`Saved restaurant : ${restaurant.name}`);
          });
        } catch (err) {
          throw err;
        };

        //Socket Trigger All Clients
        io.socket.emit('updateRestaurant', restaurantData);

        ack()
      });

      broker.subscribe('updateRestaurantById', (msg, ack) => {

        const restaurantData = JSON.parse(msg.content.toString());
        const restaurant = new Restaurant(restaurantData);
        console.log(`Receiving restaurant by Id: ${restaurant.name}`);
        //save in db
        restaurant.save();
        //Socket Trigger All Clients
        io.socket.emit('updateRestaurantById', restaurantData);

        ack()
      });

      broker.subscribe('updateRestaurantFieldsById', (msg, ack) => {
        const restaurantData = JSON.parse(msg.content);
        const restaurant = new Restaurant(restaurantData);
        console.log(`Receiving restaurant fields by Id: ${restaurant.name}`);
        //save in db
        restaurant.save();
        //Socket Trigger All Clients
        io.socket.emit('updateRestaurantFieldsById', restaurantData);

        ack()
      });

      broker.subscribe('removeRestaurantById', (msg, ack) => {

        const restaurantData = JSON.parse(msg.content.toString());
        const restaurant = new Restaurant(restaurantData);
        console.log(`Removing restaurant  by Id: ${restaurant.name}`);
        //remove
        restaurant.remove();
        //Socket Trigger All Clients
        io.socket.emit('removeRestaurantById', restaurantData);

        ack();
      });
    });
}

module.exports = consumeRestaurant;

