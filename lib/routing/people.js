const People = require('../models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');
const  notFound = require('./notFound');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  //sets our data up for json
  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        //(NOTE TO SELF)because we're working with people.js
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
  //finds by id and delete
  else if(req.method === 'DELETE' && url.pathname.includes('/people/')){
    const _id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(_id, (err, deletedName) =>{
      res.end(JSON.stringify(deletedName));
    });
  }
  else if(url.pathname === '/other'){
    return notFound(req, res);

  }

};
