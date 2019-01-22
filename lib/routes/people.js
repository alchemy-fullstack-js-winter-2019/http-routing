const People = require('../../lib/models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');
const { getStarWarsChar } = require('../services/starWarsApi');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  const throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

  // GET /people/:id returns a person with :id
  if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (throwErrOrObj));
  }

  // POST /people creates a new person and sends back json
  else if(req.method === 'POST' && url.pathname.includes('/people')) {
    bodyParser(req)
      .then(({ name, age, favoriteColor, favoriteCharacterId }) => {
        getStarWarsChar(favoriteCharacterId)
          .then(favoriteCharacter => {
            People.create({
              name,
              age,
              favoriteColor,
              favoriteCharacter
            }, (throwErrOrObj));
          });
      });
  } 

  // GET /people returns a list of people
  else if(req.method === 'GET' && url.pathname.includes('/people')) {
    People.find((throwErrOrObj));
  }

  // PUT /people/:id updates a person with :id and returns the update
  else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(({ name, age, favoriteColor, favoriteCharacterId }) => {
        getStarWarsChar(favoriteCharacterId)
          .then(favoriteCharacter => {
            People.findByIdAndUpdate(id, {
              name,
              age,
              favoriteColor,
              favoriteCharacter
            }, (throwErrOrObj));
          });
      });
  }

  //DELETE /people/:id deletes a person with :id and returns the delete count
  if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(id, (throwErrOrObj));
  }

};
