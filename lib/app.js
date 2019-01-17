const People = require('./models/People');
const { parse } = require('url');
const bodyParser = require('./bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({ name: body.name, age: body.age, favoriteColor: body.favoriteColor, _id: body._id }, (err, data) => {
          res.end(JSON.stringify(data));
        });
      });
  }
  else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, data) => {
      res.end(JSON.stringify(data));
    });
  }
};
