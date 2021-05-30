const Category = require('../models/categoryModel');
const RabbitMQ = require('../rabbitMQ');

function consumeCategory() {
  RabbitMQ.getInstance()
    .then(broker => {

      broker.subscribe('addCategory', (msg, ack) => {

        const categoryData = JSON.parse(msg.content.toString());
        const category = new Category(categoryData);
        console.log(`Receiving categories: ${category.name}`);
        try {
          //save in db
          category.save().then(() => {
            console.log(`Saved category : ${category.name}`);
          });
        } catch (err) {
          throw err;
        };
        ack()
      });

      broker.subscribe('updateCategoryById', (msg, ack) => {

        const categoryData = JSON.parse(msg.content.toString());
        const category = new Category(categoryData);
        console.log(`Receiving category by Id: ${category.name}`);
        try {
          //save in db
          category.save().then(() => {
            console.log(`Updated category : ${category.name}`);
          });
        } catch (err) {
          throw err;
        };
        ack()
      });

      broker.subscribe('updateCategoryFieldsById', (msg, ack) => {
        const categoryData = JSON.parse(msg.content.toString());
        const category = new Category(categoryData);
        console.log(`Receiving category fields by Id: ${category.name}`);
        try {
          //save in db
          category.save().then(() => {
            console.log(`Updated category : ${category.name}`);
          });
        } catch (err) {
          throw err;
        };
        ack();
      });

      broker.subscribe('removeCategoryById', (msg, ack) => {

        const categoryData = JSON.parse(msg.content.toString());
        const category = new Category(categoryData);
        console.log(`Removing category  by Id: ${category.name}`);
        try {
          //remove from db
          category.remove().then(() => {
            console.log(`Removed category : ${category.name}`);
          });
        } catch (err) {
          throw err;
        };
        ack();
      });
    });
}

module.exports = consumeCategory;

