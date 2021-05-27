function restaurantController(Restaurant) {

  function post(req, res) {
    const restaurant = new Restaurant(req.body);
    if(!req.body.name){
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
      return res.json(restaurants);
    })
      .sort(mysort);
  }

  return { post, get };
}

module.exports = restaurantController;