const People = require('../lib/models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');


module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const url = parse(req.url, true);
  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req) 
      .then(body => {
        People.create({ 
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, createdPerson) => {
          res.end(JSON.stringify(createdPerson));
        });
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
          res.end(JSON.stringify(createdPerson));
        });
      });
  }
  else if
  (url.pathname.includes('/people/') && req.method === 'GET') {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (err, foundPerson) => {
      res.end(JSON.stringify(foundPerson));
    });
  }
  else if
  (url.pathname === '/people' && req.method === 'GET') {
    People.find((err, listOfPeople) => {
      res.end(JSON.stringify(listOfPeople));
    });
  }
};

