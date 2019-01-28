const People = require('../models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');
const { getCharacter } = require('../services/starWarsApi');

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
        return Promise.all([
          Promise.resolve(body),
          getCharacter(body.favoriteCharacterId)
        ]).then(([body, character]) => {
          People.create({ 
            name: body.name, 
            age: body.age, 
            favoriteColor: body.favoriteColor,
            favoriteCharacter: {
              name: character.name,
              hairColor: character.hairColor,
              height: character.height,
              mass: character.mass,
              birthYear: character.birth_Year
            }
          }, errOrStringify);
        });
      });
  }

  else if(req.method === 'GET' && url.pathname.includes('/people')) {
    People.find(errOrStringify);
  }

};
