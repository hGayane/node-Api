const express = require('express');
const mongoose = require('mongoose');
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

const restaurantRouter = require('./routes/restaurantRouter')(Restaurant,cache);
const userRouter = require('./routes/userRouter')(User);
const categoryRouter = require('./routes/categoryRouter')(Category,cache);
const adminRouter = require('./routes/adminRouter')();
const authRouter = require('./routes/authRouter')(User, cache);

require('./consumers/restaurantConsumer')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session(
  {
    secret: 'restaurant',
    resave: true,
    saveUninitialized: true
  }
));

require('./config/passport.js')(app, User);

app.use('/api', restaurantRouter);
app.use('/api', userRouter);
app.use('/api', adminRouter);
app.use('/api', categoryRouter);
app.use('/api', authRouter);

var memoryCache = require('./memoryCache.js');
var cache = {};

app.use((req, res, next) => {
  if (req.user) {
    cache = memoryCache({
      limit: 1000,
      buckets: 3
    });
    next();
  }
});

app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;