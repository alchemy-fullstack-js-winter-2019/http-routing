const { parse } = require('url');
const bodyParser = require('../bodyParser');
const Dogs = require('../models/Dogs');

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
  
  if(req.method === 'POST' && url.pathname.includes('/dogs')) {
    bodyParser(req)
      .then(body => {
        Dogs.create({
          _id: expect.any(String),
          breed: body.breed,
          name: body.name
        }, errOrStringify);
      });
  }

  else if(req.method === 'GET' && url.pathname.includes('/dogs/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Dogs.findById(id, errOrStringify);
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/dogs/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Dogs.findByIdAndDelete(id, errOrStringify);
  }

  else if(req.method === 'PUT' && url.pathname.includes('/dogs/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Dogs.findByIdAndUpdate(id, { breed: 'pug', name: 'pig' }, errOrStringify);    
  }

  else if(req.method === 'GET' && url.pathname.includes('/dogs')) {
    Dogs.find(errOrStringify);
  }

};
