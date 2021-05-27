const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

if (process.env.ENV === 'Test') {
  console.log('This is Test');
  const db = mongoose.connect('mongodb://localhost/restausrantsApi_test')
} else {
  console.log('This is for real');
  const db = mongoose.connect('mongodb://localhost/restausrantsApi_prod')
}

const port = process.env.PORT || 3000;
const Restaurant = require('./models/restaurantModel')
const restaurantRouter = require('./routes/restaurantRouter')(Restaurant);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', restaurantRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my nodemon restaurants API');
});

app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;