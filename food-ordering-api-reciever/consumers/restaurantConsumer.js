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
        ack()
      });

      broker.subscribe('updateRestaurantById', (msg, ack) => {

        const restaurantData = JSON.parse(msg.content.toString());
        const restaurant = new Restaurant(restaurantData);
        console.log(`Receiving restaurant by Id: ${restaurant.name}`);
        try {
          //save in db
          restaurant.save().then(() => {
            console.log(`Updated restaurant : ${restaurant.name}`);
          });
        } catch (err) {
          throw err;
        };

        ack()
      });

      broker.subscribe('updateRestaurantFieldsById', (msg, ack) => {
        const restaurantData = JSON.parse(msg.content);
        const restaurant = new Restaurant(restaurantData);
        console.log(`Receiving restaurant fields by Id: ${restaurant.name}`);
        try {
          //save in db
          restaurant.save().then(() => {
            console.log(`Updated restaurant : ${restaurant.name}`);
          });
        } catch (err) {
          throw err;
        };
        ack()
      });

      broker.subscribe('removeRestaurantById', (msg, ack) => {

        const restaurantData = JSON.parse(msg.content.toString());
        const restaurant = new Restaurant(restaurantData);
        console.log(`Removing restaurant  by Id: ${restaurant.name}`);
        try {
          //remove from db
          restaurant.remove().then(() => {
            console.log(`Removed restaurant : ${category.name}`);
          });
        } catch (err) {
          throw err;
        };
        ack();
      });
    });
}

module.exports = consumeRestaurant;

