const Cats  = require('../../lib/models/Cats');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  const throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader = ('Content-Type', 'application/json');

  if(req.method === 'GET' && url.pathname.includes('/cats/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Cats.findById(id, (throwErrOrObj));
  } else if(req.method === 'POST' && url.pathname.includes('/cats')) {
    bodyParser(req)
      .then(body => {
        Cats.create({
          name: body.name,
          age: body.age,
          favoriteFood: body.favoriteFood
        }, (throwErrOrObj));
      }); 
  } else if(req.method === 'GET' && url.pathname.includes('/cats')) {
    Cats.find((throwErrOrObj));
  } else if(req.method === 'PUT' && url.pathname.includes('/cats/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Cats.findByIdAndUpdate(id, {
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (throwErrOrObj));
      });
  }

  if(req.method === 'DELETE' && url.pathname.includes('/cats/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Cats.findByIdAndDelete(id, (throwErrOrObj));
  }
};
