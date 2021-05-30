# node-Api
API for ordering food from restaurants

Consisted of two servies `food-ordering-api-reciever` and  `food-ordering-api`. 
Fist one is serparatly consuming messages from RabbitMQ and updating db.
Second one is publishing messaged to RabbitMQ and returning results from db based on api calls.

Need to run both seperately (`npm start`) .

# Used technologies:

  1.NodeJs,Express
  
  2.MongoDb (make sure you have mongo db installed locally for runing the Api's)
  
  3.RabbitMQ (make sure yo have rabbitmq configured locally for runing the Api's)
  
  
For authentication used `PassportJS` and `jsonwebtoken`.

Api routes are configure in Postman `Node-APi` collection, which is pushed allonge with code source.

After running servies, can hit the route `http://localhost:4000/api/init` for initialaising db by inserting some docment examples.


