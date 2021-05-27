function restaurantController(Restaurant) {

  function post(req, res) {
    const restaurant = new Restaurant(req.body);
    if (!req.body.name) {
      res.status(400);
      return res.send('Name is required');
    }

    restaurant.save();
    res.status(201);
    return res.json(restaurant);
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

  return { post, get };
}

module.exports = restaurantController;