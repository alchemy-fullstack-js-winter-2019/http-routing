const bodyParser = require('../bodyParser');
const People = require('../models/People');
const { getCharacter } = require('../starWarsApi');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        return Promise.all([
          Promise.resolve(body),
          getCharacter(body.favoriteCharId)
        ]);
      })
      .then(([body, character]) => {
        const { name, height, mass, hair_color, birth_year } = character;
        People.create({ 
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor,
          favoriteCharId: body.favoriteCharId,
          favoriteCharacter: { 
            name, 
            height,
            mass,
            hair_color,
            birth_year
          }
        }, (err, createdPerson) => {
          res.end(JSON.stringify(createdPerson));
        });
      });
  }

  else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      res.end(JSON.stringify(listOfPeople));
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (err, foundPerson) => {
      res.end(JSON.stringify(foundPerson));
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        People.findByIdAndUpdate(id, body, (err, updatedPerson) => {
          res.end(JSON.stringify(updatedPerson));
        });
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(id, (err, deletedPerson) => {
      res.end(JSON.stringify(deletedPerson));
    });
  }
};
