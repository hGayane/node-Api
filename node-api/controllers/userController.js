const rabbitMQ = require('../rabbitMQ.js');

function userController(User) {

  function post(req,res) {
    const user = new User(req.body);
    if (!req.body.email || !req.body.phoneNumber) {
      res.status(400);
      return res.send('Email, phone, username and password are required.');
    }
      user.save();
      return user;
  }

  function get(req, res) {
    const query = {};
    if (req.query.username) {
      query.username = req.query.username;
    }
    var mysort = { fname: -1 };
    User.find(query, (err, users) => {
      if (err) {
        return res.send(err);
      }

      const returnUsers = users.map((user) => {
        const newUser = user.toJSON();
        newUser.links = {};
        newUser.links.self = `http://${req.headers.host}/api/users/${user._id}`;
        return newUser;
      });
      return res.json(returnUsers);
    })
      .sort(mysort);
  }

  return { post, get };
}

module.exports = userController;