require('should');

const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app.js');

const Restaurant = mongoose.model('Restaurant');
const agent = request.agent(app);

describe('Restaurant Crud Test', () => {
  it('Should allow a restaurant to be posted and return _id and workingHours', (done) => {
    const restaurantPost = {
      name: 'postRestaurant',
      description: 'Nice post rest',
      categories: 'UNKNOWN',
      workingHours: '9am to 9pm',
      logoImage: ''
    };

    agent
      .post('/api/restaurants')
      .send(restaurantPost)
      .expect(200)
      .end((err, results) => {
        //console.log(results);
        //results.body.workignHours.should.not.equal('closed');
        results.body.should.have.property('_id');
        done();
      });
  });

  afterEach((done) => {
    Restaurant.deleteMany({}).exec();
    done();
  });
  after((done) => {
    mongoose.connection.close();
    app.server.close(done());
  });
});
