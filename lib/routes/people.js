const People = require('../models/People');
const { parse } = require('url');
const bodyParser = require('../bodyParser');

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
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          } else {
            res.end(JSON.stringify(createdPerson));
          }
        });
      });
  }
  
  else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify(listOfPeople));
      }
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (err, person) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify(person));
      }
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        People.findByIdAndUpdate(id, {
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, updatedPerson) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          } else {
            res.end(JSON.stringify(updatedPerson));
          }
        });
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(id, (err) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ deleted: 0 }));
      } else {
        res.end(JSON.stringify({ deleted: 1 }));
      }
    });
  }
};
