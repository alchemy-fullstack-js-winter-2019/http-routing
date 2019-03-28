const People = require('../models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');
const { getCharacter } = require('../../service/StarWarsApi');


module.exports = (req, res) => {
  const url = parse(req.url, true);

  const throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (throwErrOrObj));
  } else if(req.method === 'POST' && url.pathname.includes('/people')) {
    bodyParser(req)
      .then(({ name, age, favoriteColor, favoriteCharacterId }) => {
        getCharacter(favoriteCharacterId)
          .then(favoriteCharacter => {
            People.create({
              name,
              age,
              favoriteColor,
              favoriteCharacter
            }, (throwErrOrObj));
          });
      });
  } else if(req.method === 'GET' && url.pathname.includes('/people')) {
    People.find((throwErrOrObj));
  } else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(({ name, age, favoriteColor, favoriteCharacterId }) => {
        getCharacter(favoriteCharacterId)
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

  if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(id, (throwErrOrObj));
  }

};

