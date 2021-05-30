# node-Api
API for ordering food from restaurants

Consisted of two servies `food-ordering-api-reciever` and  `food-ordering-api`. 
Fist one is serparatly consuming messages from RabbitMQ and updating db.
Second one is publishing messages to RabbitMQ and returning results from db based on api calls.

Need to run both seperately (`npm start`) .

# Used technologies:

  1.NodeJs,Express
  
  2.MongoDb (make sure you have mongo db installed locally for runing the Api's)
  
  3.RabbitMQ (make sure yo have rabbitmq configured locally for runing the Api's)
  
  
For authentication used `PassportJS` and `jsonwebtoken`.

Api routes are configured in Postman `Node-APi` collection, which is pushed allong with code source (you can play with request body and query params).

After running servies by hitting the route `http://localhost:4000/api/init` db will be initialised with some document examples.


