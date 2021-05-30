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
    const queryString = {};
    const sortBy = {};
    if (req.query.sortBy && req.query.direction) {
      let sort = req.query.sortBy;
      let direction = req.query.direction
      sortBy = { sort: direction };
    }
    if (req.query.name) {
      queryString.name = req.query.name;
      searchRestaurantsByName(Restaurant, queryString, sortBy, res)
    }
    if (req.query.page) {
      let perPage = req.query.perpage ? req.query.perpage : 10;
      queryString.perPage = perPage;
      queryString.page = req.query.page;
      getRestaurantsByPagination(Restaurant, queryString, res);
    }
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

function searchRestaurantsByName(Restaurant, queryString, sortBy, res) {

  Restaurant.find(queryString,
    async (err, restaurants) => {
      if (err) {
        return res.send(err);
      }
      return res.json(restaurants);
    })
    .sort(sortBy);
}
function searchRestaurantsByCatgeoryName() { }

function getRestaurantsByPagination(Restaurant, queryString, res) {

  const options = {
    page: queryString.page,
    limit: queryString.perPage
  };

  var myAggregate = Restaurant.aggregate();
  Restaurant.aggregatePaginate(myAggregate, options, function (err, restaurants) {
    if (err)
      return res.send(err);
    else {
      return res.json(restaurants);
    }
  });
}


module.exports = restaurantController;