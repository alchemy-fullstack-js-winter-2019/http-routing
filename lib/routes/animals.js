const Animals = require('../models/Animals');
const { parse } = require('url');
const bodyParser = require('../bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname === '/animals') {
    bodyParser(req) 
      .then(body => {
        Animals.create({ 
          name: body.name,
          type: body.type,
        }, (err, createdAnimal) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          } else {
            res.end(JSON.stringify(createdAnimal));
          }
        });
      });
  }

  else if(req.method === 'GET' && url.pathname === '/animals') {
    Animals.find((err, listOfAnimals) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify(listOfAnimals));
      }
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/animals/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Animals.findById(id, (err, animal) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify(animal));
      }
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/animals/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Animals.findByIdAndUpdate(id, {
          name: body.name,
          type: body.type
        }, (err, updatedAnimal) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          } else {
            res.end(JSON.stringify(updatedAnimal));
          }
        });
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/animals/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Animals.findByIdAndDelete(id, (err) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ deleted: 0 }));
      } else {
        res.end(JSON.stringify({ deleted: 1 }));
      }
    });
  }
};
