const People = require('./models/People');
const { parse } = require('url');
const bodyParser = require('./bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({ name: body.name }, (err, data) => {
      
      
          res.end();
        });
      });
  }
};
