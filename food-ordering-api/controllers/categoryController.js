const RabbitMQ = require('../rabbitMQ.js');

function categoryController(Category) {
  let broker = {};
  RabbitMQ.getInstance().then((b) => {
    broker = b;
  }).catch(err => {
    console.log(`There was an ${err} during connecting rabbitmq.`)
  });

  function post(req, res) {
    if (!req.body.name) {
      res.status(400);
      return res.send('Name is required');
    }

    broker.send('addCategory', Buffer.from(JSON.stringify(req.body)));

    res.status(201);
    return res.json(req.body);
  }

  function get(req, res) {
    const queryString = {};
    if (req.query.page) {
      let perPage = req.query.perpage ? req.query.perpage : 10;
      queryString.perPage = perPage;
      queryString.page = req.query.page;

      const options = {
        page: queryString.page,
        limit: queryString.perPage
      };

      var myAggregate = Category.aggregate();
      Category.aggregatePaginate(myAggregate, options, function (err, categories) {
        if (err)
          return res.send(err);
        else {
          return res.json(categories);
        }
      });
    }
  }

  function updateDocumentById(req, res) {
    if (!req.body.name) {
      res.status(400);
      return res.send('Name is required');
    }

    broker.send('updateCategoryById', Buffer.from(JSON.stringify(req.body)));

    res.status(201);
    return res.json(req.body);
  }

  function updateDocumentFieldsById(req, res) {
    const { category } = req;

    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      category[key] = value;
    });

    //broker.send('updateCategoryFieldsById', Buffer.from(JSON.stringify(req.body)));
    category.save();
    res.status(201);
    return res.json(category);

  }
  function deleteDocumentById(req, res) {
    broker.send('removeCategoryById', Buffer.from(JSON.stringify(req.category)));
    return res.sendStatus(204);//removed
  }

  return { post, get,  updateDocumentById, updateDocumentFieldsById, deleteDocumentById };
}

module.exports = categoryController;