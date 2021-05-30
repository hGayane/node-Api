const express = require('express');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

if (process.env.ENV === 'Test') {
  console.log('This is Test');
  const db = mongoose.connect('mongodb://localhost/restausrantsApi_test');
} else {
  console.log('This is for real');
  const db = mongoose.connect('mongodb://localhost/restausrantsApi');
}

const rabbitMQ = require('./rabbitMQ.js');
const port = process.env.PORT || 3000;

const Restaurant = require('./models/restaurantModel');
const User = require('./models/userModel.js');
const Category = require('./models/categoryModel.js');

require('./consumers/restaurantConsumer')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const accessTokenSecret = 'TOP_SECRET';
require('./config/passport.js')(app, User);

const cache = {};

const restaurantRouter = require('./routes/restaurantRouter')(Restaurant, accessTokenSecret, jwt, cache);
const userRouter = require('./routes/userRouter')(User, accessTokenSecret, jwt, cache);
const categoryRouter = require('./routes/categoryRouter')(Category, accessTokenSecret, jwt, cache);

const initRouter = require('./routes/initRouter')();
const authRouter = require('./routes/authRouter')(User, accessTokenSecret);

app.use('/api', restaurantRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);

app.use('/api', authRouter);
app.use('/api', initRouter);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.server = app.listen(port, () => {
  console.log(`Server started, port ${port}`);
});

module.exports = app;