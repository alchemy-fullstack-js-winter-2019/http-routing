const People = require('./models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');
const { getPerson } = require('./models/People');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  const id = url.pathname.slice(1).split('/')[1];
  res.setHeader('Content-Type', 'application/json');

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
  } else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      res.end(JSON.stringify(listOfPeople));
    });
  } else if(req.method === 'GET' && url.pathname === '/people/id') {
    People.find((err, listOfPeople) => {
      res.end(JSON.stringify(listOfPeople));
    });
  } else if(url.pathname.includes('/people')) {
    getPerson(id)
      .then(person => {
        person.split('/');
      });
  }
      

  

};
