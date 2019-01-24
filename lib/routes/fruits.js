const Fruits = require('../models/Fruits');
const bodyParser = require('../bodyParser');
const { parse } = require('url');


module.exports = (req, res) => {
  const url = parse(req.url, true);

  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'POST' && url.pathname === '/fruits') {
    bodyParser(req)
      .then(body => {
        Fruits.create({
          name: body.name,
          age: body.age,
          color: body.color
        }, (err, createdFruit) => {
          res.end(JSON.stringify(createdFruit));
        });
      });
  } else if(req.method === 'GET' && url.pathname === '/fruits') {
    Fruits.find((err, listOfFruits) => {
      res.end(JSON.stringify(listOfFruits));
    });
  }
  else if((req.method === 'GET' && url.pathname.includes('/fruits/'))) {
    const id = url.pathname.slice(1).split('/')[1];
    Fruits.findById(id, (err, foundFruit) => {
      if(err) {
        res.statusCode = 404;
        res.end(JSON.stringify(err));
      }
      else {
        res.end(JSON.stringify(foundFruit));
      } 
    });
  } 
  else if((req.method === 'PUT' && url.pathname.includes('/fruits/'))) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Fruits.findByIdAndUpdate(id, body, (err, updatedFruit) => {
          res.end(JSON.stringify(updatedFruit));
        });
      });
  }
  else if((req.method === 'DELETE' && url.pathname.includes('/fruits/'))) {
    const id = url.pathname.slice(1).split('/')[1];
    Fruits.findByIdAndDelete(id, (err, data) => {
      res.end(JSON.stringify(data));

    });
  } 
};  
