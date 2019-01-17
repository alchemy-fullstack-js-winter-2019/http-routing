const People = require('../models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

const getId = url => url.pathname.slice(1).split('/')[1];

module.exports = (req, res) => {
  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, createdPerson) => {
          res.send(createdPerson);
        });  
      });
  } else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      res.send(listOfPeople);
    });
  } else if(req.method === 'GET' && url.pathname === '/people/id') {
    const id = url.slice(0).split('/')[1];
    People.findById((id, (err, foundPerson) => {
      res.send(foundPerson);
    }));

  } else if(req.method === 'PUT' && url.pathname.includes('/people/id')) {
    bodyParser(req)
      .then(({ name, age, favoriteColor }) => {
        People.findByIdAndUpdate(getId(url), {
          name,
          age,
          favoriteColor
        }, (err, updatedPerson) => {
          res.sendWithError(err, updatedPerson);
        });
      });

  } 
};