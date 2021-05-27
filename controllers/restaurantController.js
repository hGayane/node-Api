function restaurantController(Restaurant, rabbitMQ) {

  function post(req, res) {
    //const restaurant = new Restaurant(req.body);
    if (!req.body.name) {
      res.status(400);
      return res.send('Name is required');
    }
    rabbitMQ("updateRestaurant", JSON.stringify(req.body));
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
    const category = req.restaurant.categories.replace(' ', '%20');

    newRestaurant.links = {};
    newRestaurant.links.FilterByName = `http://${req.headers.host}/api/restaurants?name=${name}`;
    newRestaurant.links.FilterByCategory = `http://${req.headers.host}/api/restaurants?category=${category}`;

    return res.json(newRestaurant);
  }

  function updateDocumentById(req, res) {
    const { restaurant } = req;
    restaurant.name = req.body.name;
    restaurant.description = req.body.description;
    restaurant.categories = req.body.categories;
    restaurant.workingHours = req.body.workingHours;
    restaurant.logoImage = req.body.logoImage;
    req.restaurant.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(restaurant);
    });
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
    req.restaurant.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(restaurant);
    })
  }
  function deleteDocumentById(req, res) {
    req.restaurant.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);//removed
    });
  }

  return { post, get, getById, updateDocumentById, updateDocumentFieldsById, deleteDocumentById };
}

module.exports = restaurantController;