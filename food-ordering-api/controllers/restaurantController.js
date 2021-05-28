const RabbitMQ = require('../rabbitMQ.js');

function restaurantController(Restaurant) {
  let broker = {};
  RabbitMQ.getInstance().then((b) => {
    broker = b;
  }).catch(err => {
    console.log(`There was an ${err} during connecting rabbitmq.`)
  });

  function post(req, res) {
    if (!req.body.name) {
      res.status(400);
      return res.send('Name is required');
    }

    broker.send('updateRestaurant', Buffer.from(JSON.stringify(req.body)));

    res.status(201);
    return res.json(req.body);
  }

  function get(req, res) {
    const query = {};
    if (req.query.name) {
      query.name = req.query.name;
    }
    var mysort = { name: -1 };
    Restaurant.find(query, (err, restaurants) => {
      if (err) {
        return res.send(err);
      }

      const returnRestaurants = restaurants.map((restaurant) => {
        const newRestaurant = restaurant.toJSON();
        newRestaurant.links = {};
        newRestaurant.links.self = `http://${req.headers.host}/api/restaurants/${restaurant._id}`;
        return newRestaurant;
      });
      return res.json(returnRestaurants);
    })
      .sort(mysort);
  }

  function getById(req, res) {

    const newRestaurant = req.restaurant.toJSON();
    const name = req.restaurant.name.replace(' ', '%20');

    newRestaurant.links = {};
    newRestaurant.links.FilterByName = `http://${req.headers.host}/api/restaurants?name=${name}`;

    return res.json(newRestaurant);
  }

  function updateDocumentById(req, res) {
    if (!req.body.name) {
      res.status(400);
      return res.send('Name is required');
    }

    broker.send('updateRestaurantById', Buffer.from(JSON.stringify(req.body)));

    res.status(201);
    return res.json(req.body);
  }

  function updateDocumentFieldsById(req, res) {
    const { restaurant } = req;

    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      restaurant[key] = value;
    });

    //broker.send('updateRestaurantFieldsById', Buffer.from(JSON.stringify(req.body)));
    restaurant.save();
    res.status(201);
    return res.json(restaurant);

  }
  function deleteDocumentById(req, res) {
    broker.send('removeRestaurantById', Buffer.from(JSON.stringify(req.restaurant)));
    return res.sendStatus(204);//removed
  }

  return { post, get, getById, updateDocumentById, updateDocumentFieldsById, deleteDocumentById };
}

module.exports = restaurantController;