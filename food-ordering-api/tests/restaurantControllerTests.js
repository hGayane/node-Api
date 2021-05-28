const should = require('should');
const sinon = require('sinon');
const restaurantController = require('../controllers/restaurantController');

describe('Restaurant Controller Tests:', () => {
  describe('Post', () => {
    it('should not allow an empty name on post', () => {
      //mock restaurant object, req , res
      const Restaurant = function (restaurant) { this.save = () => { } };

      const req = {
        body: {
          decription: 'restaurant description'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = restaurantController(Restaurant);
      controller.post(req,res);

      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith('Name is required').should.equal(true);
    });
  });
});