const tweetsRoutes = require('./routes/tweets');
const peopleRoutes = require('./routes/people');
const { parse } = require('url');
const bodyParser = require('./bodyParser');
const Dogs = require('./models/Dogs');

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

  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  }

  else if(url.pathname.includes('/tweets')) {
    return tweetsRoutes(req, res);
  }

  else if(req.method === 'POST' && url.pathname.includes('/dogs')) {
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


  else if(req.method === 'GET' && url.pathname.includes('/dogs')) {
    Dogs.find(errOrStringify);
  }

};
