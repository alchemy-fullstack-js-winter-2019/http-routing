const People = require('../models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');

  const errOrStringify = (err, obj) => {
    if(err) {
      res.statusCode = 400;
      res.end(JSON.stringify(err));
    } else {
      res.end(JSON.stringify(obj));
    }
  };

  if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, errOrStringify);
  }

  else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndUpdate(id, { name: 'banana', age: '20', favoriteColor: 'blue' }, errOrStringify);
  }
  
  else if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(id, errOrStringify);
  }

  else if(req.method === 'POST' && url.pathname.includes('/people')) {
    bodyParser(req)
      .then(body => {
        People.create({ 
          name: body.name, 
          age: body.age, 
          favoriteColor: body.favoriteColor
        }, errOrStringify);
      });
  }

  else if(req.method === 'GET' && url.pathname.includes('/people')) {
    People.find(errOrStringify);
  }

};
