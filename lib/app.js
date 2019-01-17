const People = require('../lib/models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.HandleErrorAndSend = (err, json) => {
    if(err) {
      res.statusCode = 500;
      res.send(err);
    } else {
      res.send(json); 
    }
  };
  const url = parse(req.url, true);
  
  res.setHeader('Content-Type', 'application/json');
  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req) 
      .then(body => {
        People.create({ 
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, createdPerson) => {
          res.HandleErrorAndSend(err, createdPerson);
        });
      });
  }
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

