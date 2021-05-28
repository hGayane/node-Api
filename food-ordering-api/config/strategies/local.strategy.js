const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    }, (username, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'restausrantsApi';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);

          console.log('Connected correctly to db server');

          const db = client.db(dbName);
          const col = db.collection('users');

          const user = await col.findOne({ email: `${username}` });

          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          console.log(err.stack);
        }
        // Close connection
        client.close();
      }());
    }));
};
