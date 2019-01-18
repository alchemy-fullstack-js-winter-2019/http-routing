const Puppies = require('../../lib/models/Puppies');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  const throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

  // GET /puppies/:id returns a puppy with :id
  if(req.method === 'GET' && url.pathname.includes('/puppies/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Puppies.findById(id, (throwErrOrObj));
  }

  // POST /puppies creates a new puppy and sends back json
  else if(req.method === 'POST' && url.pathname.includes('/puppies')) {
    bodyParser(req)
      .then(body => {
        Puppies.create({
          name: body.name,
          age: body.age,
          favoriteFood: body.favoriteFood
        }, (throwErrOrObj));
      }); 
  } 

  // GET /puppies returns a list of puppies
  else if(req.method === 'GET' && url.pathname.includes('/puppies')) {
    Puppies.find((throwErrOrObj));
  }

  // PUT /puppies/:id updates a puppy with :id and returns the update
  else if(req.method === 'PUT' && url.pathname.includes('/puppies/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Puppies.findByIdAndUpdate(id, {
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (throwErrOrObj));
      });
  }

  //DELETE /puppies/:id deletes a puppy with :id and returns the delete count
  if(req.method === 'DELETE' && url.pathname.includes('/puppies/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Puppies.findByIdAndDelete(id, (throwErrOrObj));
  }

};
