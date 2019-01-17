const People = require('./models/People');
const bodyParser = require('./models/bodyParser');
const { parse } = require('url');


module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST' && URL.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({ name: body.name }, (err, data) => {
          res.end();
        });
      });
  }
};
