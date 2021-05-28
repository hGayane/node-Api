const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();



if (process.env.ENV === 'Test') {
  console.log('This is Test');
  const db = mongoose.connect('mongodb://localhost/restausrantsApi_test');
} else {
  console.log('This is for real');
  const db = mongoose.connect('mongodb://localhost/restausrantsApi');
}

const port = process.env.PORT || 3000;

const Restaurant = require('./models/restaurantModel');
const User = require('./models/userModel.js');
const Category = require('./models/categoryModel.js');

const rabbitMQ = require('./rabbitMQ.js');

const restaurantRouter = require('./routes/restaurantRouter')(Restaurant);
const userRouter = require('./routes/userRouter')(User);
const categoryRouter = require('./routes/categoryRouter')(Category);

const adminRouter = require('./routes/adminRouter')();

const resaurantConsumers = require('./consumers/restaurantConsumer')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', restaurantRouter);
app.use('/api', userRouter);
app.use('/api', adminRouter);
app.use('/api', categoryRouter);



app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;