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
      sortBy[sort] = direction;
      searchRestaurantsBySort(Restaurant, sortBy, res);
    }
    if (req.query.name) {
      queryString.name = req.query.name;
      searchRestaurantsByName(Restaurant, queryString, res);
    }
    if (req.query.page) {
      let perPage = req.query.perpage ? req.query.perpage : 10;
      queryString.perPage = perPage;
      queryString.page = req.query.page;
      getRestaurantsByPagination(Restaurant, queryString, res);
    }
  }

  function getById(req, res) {

    const newRestaurant = req.data.toJSON();
    const name = req.data.name.replace(' ', '%20');

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
    broker.send('updateRestaurantFieldsById', Buffer.from(JSON.stringify(req.body)));
    data.save();
    res.status(201);
    return res.json(restaurant);
  }

  function deleteDocumentById(req, res) {

    broker.send('removeRestaurantById', Buffer.from(JSON.stringify(req.data)));
    return res.sendStatus(204);//removed
  }

  function addMenueToRestaurant(req, res) {

    broker.send('addMenuToRestaurant', Buffer.from(JSON.stringify(req.data)));
    res.status(201);
    return res.json(req.data);
  }

  function rateRestaurant(req, res) {

    broker.send('rateRestaurant', Buffer.from(JSON.stringify(req.data)));
    res.status(201);
    return res.json(req.data);
  }

  function reviewRestaurant(req, res) {

    broker.send('reviewRestaurant', Buffer.from(JSON.stringify(req.data)));
    res.status(201);
    return res.json(req.data);
  }
  return { post, get, getById, updateDocumentById, updateDocumentFieldsById, deleteDocumentById, addMenueToRestaurant, rateRestaurant, reviewRestaurant };
}

function searchRestaurantsByName(Restaurant, queryString, res) {

  Restaurant.find(queryString,
    (err, restaurants) => {
      if (err) {
        return res.send(err);
      }
      return res.json(restaurants);
    });
}
function searchRestaurantsBySort(Restaurant, sortBy, res) {
  Restaurant.find({},
    (err, restaurants) => {
      if (err) {
        return res.send(err);
      }
      return res.json(restaurants);
    })
    .sort(sortBy);
}

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