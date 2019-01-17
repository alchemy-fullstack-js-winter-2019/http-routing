const bodyParser = require('../bodyParser');
const Guitars = require('../models/Guitars');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST' && url.pathname === '/guitars') {
    bodyParser(req)
      .then(body => {
        Guitars.create({ 
          model: body.model, 
          make: body.make, 
        }, (err, createdGuitars) => {
          res.end(JSON.stringify(createdGuitars));
        });
      });
  }

  else if(req.method === 'GET' && url.pathname === '/guitars') {
    Guitars.find((err, listOfGuitars) => {
      res.end(JSON.stringify(listOfGuitars));
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/guitars/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Guitars.findById(id, (err, foundGuitars) => {
      res.end(JSON.stringify(foundGuitars));
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/guitars/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Guitars.findByIdAndUpdate(id, body, (err, updatedGuitars) => {
          res.end(JSON.stringify(updatedGuitars));
        });
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/guitars/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Guitars.findByIdAndDelete(id, (err, deletedGuitars) => {
      res.end(JSON.stringify(deletedGuitars));
    });
  }
};
