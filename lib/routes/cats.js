const Cats = require('../../lib/models/Cats');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  const throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

  // GET /cats/:id returns a cat with :id
  if(req.method === 'GET' && url.pathname.includes('/cats/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Cats.findById(id, (throwErrOrObj));
  }

  // POST /cats creates a new cat and sends back json
  else if(req.method === 'POST' && url.pathname.includes('/cats')) {
    bodyParser(req)
      .then(body => {
        Cats.create({
          name: body.name,
          age: body.age,
          favoriteFood: body.favoriteFood
        }, (throwErrOrObj));
      }); 
  } 

  // GET /cats returns a list of cats
  else if(req.method === 'GET' && url.pathname.includes('/cats')) {
    Cats.find((throwErrOrObj));
  }

  // PUT /cats/:id updates a cat with :id and returns the update
  else if(req.method === 'PUT' && url.pathname.includes('/cats/')) {
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

  //DELETE /cats/:id deletes a cat with :id and returns the delete count
  if(req.method === 'DELETE' && url.pathname.includes('/cats/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Cats.findByIdAndDelete(id, (throwErrOrObj));
  }

};
