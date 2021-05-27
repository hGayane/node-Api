const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

if (process.env.ENV === 'Test') {
  console.log('This is Test');
  const db = mongoose.connect('mongodb://localhost/restausrantsApi_test')

} else {
  console.log('This is for real');
  const db = mongoose.connect('mongodb://localhost/restausrantsApi');
}

const port = process.env.PORT || 3000;

const Restaurant = require('./models/restaurantModel');
const User = require('./models/userModel.js');
const Category = require('./models/categoryModel.js');

//User.init().then(()=>{
//  User.createIndexes({ email: 1, phoneNumber: 1 }, { unique: true });
//});
const rabbitMQ = require('./rabbitMQ');

const restaurantRouter = require('./routes/restaurantRouter')(Restaurant,rabbitMQ);
const userRouter = require('./routes/userRouter')(User,rabbitMQ);
const adminRouter = require('./routes/adminRouter');

const restaurantCosumer = require('./consumers/restaurantConsumer')(Restaurant);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', restaurantRouter);
app.use('/api', userRouter);
app.use('/api', adminRouter);

//app.use(restaurantCosumer);


app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;