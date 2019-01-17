const Dogs = require('../../lib/models/Dogs');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST' && url.pathname === '/dogs') {
    bodyParser(req) 
      .then(body => {
        Dogs.create({ 
          name: body.name,
          breed: body.breed,
          favoriteColor: body.favoriteColor
        }, (err, createdDog) => {
          res.HandleErrorAndSend(err, createdDog);
        });
      });
  }
  else if 
  (url.pathname.includes('/dogs') && req.method === 'DELETE') {
    const id = url.pathname.slice(1).split('/')[1];
    Dogs.findByIdAndDelete(id, (err, deletedDog) => {
      res.HandleErrorAndSend(err, deletedDog);
    });
  }
  else if
  (url.pathname.includes('/dogs') && req.method === 'PUT') {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Dogs.findByIdAndUpdate(id, {
          name: body.name,
          breed: body.breed,
          favoriteColor: body.favoriteColor,
          _id: expect.any(String)
        }, (err, createdDog) => {
          res.HandleErrorAndSend(err, createdDog);
        });
      });
  }
  else if
  (url.pathname.includes('/dogs') && req.method === 'GET') {
    const id = url.pathname.slice(1).split('/')[1];
    if(id) {
      Dogs.findById(id, (err, foundDog)=> {
        res.HandleErrorAndSend(err, foundDog);
      });
    }
    else if
    (url.pathname === '/dogs' && req.method === 'GET') {
      Dogs.find((err, listOfDogs) => {
        res.HandleErrorAndSend(err, listOfDogs);
      });
    }
  }
};
