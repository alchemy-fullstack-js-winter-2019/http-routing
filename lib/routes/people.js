const People = require('../../lib/models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');
const { getCharacter } = require('../GetCharacter');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req) 
      .then(body => {
        return Promise.all([
          Promise.resolve(body),
          getCharacter(body.favoriteCharacterId)
        ]);
      })
      .then(([body, character])=> {
        const { name, hair_color, gender } = character;
        People.create({ 
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor,
          favoriteCharacterId: body.favoriteCharacterId,
          favoriteCharacter: {
            name,
            hair_color,
            gender
          }
        }, (err, createdPerson) => {
          res.HandleErrorAndSend(err, createdPerson);
        });
      });
  }
  // if(url.pathname.includes('/people/') && req.method === 'GET') {
  //   const id = url.pathname.slice(1).split('/')[1];
  //   getCharacter(id)
  //     .then(body => {
  //       People.create({ 
  //         name: body.name,
  //         hair_color: body.hair_color,
  //         gender: body.gender
  //       }, (err, createdPerson) => {
  //         res.HandleErrorAndSend(err, createdPerson);
  //       });
  //     });
  // }
  else if 
  (url.pathname.includes('/people/') && req.method === 'DELETE') {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(id, (err, deletedPerson) => {
      res.HandleErrorAndSend(err, deletedPerson);
    });
  }
  else if
  (url.pathname.includes('/people') && req.method === 'PUT') {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        People.findByIdAndUpdate(id, {
          name: 'marcy2',
          age: 40,
          favoriteColor: body.favoriteColor,
          _id: expect.any(String)
        }, (err, createdPerson) => {
          res.HandleErrorAndSend(err, createdPerson);
        });
      });
  }
  else if
  (url.pathname.includes('/people/') && req.method === 'GET') {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (err, foundPerson) => {
      res.HandleErrorAndSend(err, foundPerson);
    });
  }
  else if
  (url.pathname === '/people' && req.method === 'GET') {
    People.find((err, listOfPeople) => {
      res.HandleErrorAndSend(err, listOfPeople);
    });
  }
};

