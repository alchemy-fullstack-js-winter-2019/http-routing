/* eslint-disable no-console */

const People = require('./models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({ 
          name: body.name, 
          job: body.job,
          pets: body.pets,
        }, (err, createdPerson) => {
          // Once a person is created, the callback above fires and then we end with stringify
          res.end(JSON.stringify(createdPerson));
        });
      });
  } 
  
  else if(req.method === 'GET' && url.pathname.includes('/people/')) {
    console.log('HERE!!!!');
    const id = url.pathname.slice(1).split('/')[1];
    console.log('id:', id);
    People.findById(id, (err, foundPerson) => {
      console.log('found person:', foundPerson);
      res.end(JSON.stringify(foundPerson));
    });
  }

  else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, allPeople) => {
      res.end(JSON.stringify(allPeople));
    });
  } 
  
};
