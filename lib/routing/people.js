const People = require('../models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, createdPerson) => {
          res.sendWithError(err, createdPerson);
        });
      });
  } else if(url.pathname === '/people' && req.method === 'GET') {
    People.find((err, listOfPeople) => {
      res.sendWithError(err, listOfPeople);
    });
  } else if(url.pathname.includes('/people/') && req.method === 'GET') {
    const _id = url.pathname.slice(1).split('/')[1];
    People.findById(_id, (err, person) => {
      res.sendWithError(err, person);
    });
  } else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const _id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(({ name, age, favoriteColor }) => {
        People.findByIdAndUpdate(_id, {
          name,
          age,
          favoriteColor
        }, (err, updatedPerson) => {
          res.sendWithError(err, updatedPerson);
        });
      });
  } else if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const _id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(_id, (err, data) => {
      res.sendWithError(err, data);
    });
  }
};
