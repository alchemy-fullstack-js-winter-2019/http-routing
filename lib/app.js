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
          age: body.age,
          favoriteColor: body.favoriteColor
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
  //find by ID
  else if(req.method === 'GET' && url.pathname.includes('/people/')){
    const _id = url.pathname.slice(1).split('/')[1];
    People.findById(_id, (err, foundPerson) => {
      res.end(JSON.stringify(foundPerson));
    });
  }
  //find by ID and update
  else if(req.method === 'PUT' && url.pathname.includes('/people/')){
    const _id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        People.findByIdAndUpdate(_id, body, (err, NewName) => {
          res.end(JSON.stringify(NewName));
        });
      });
  }
};
