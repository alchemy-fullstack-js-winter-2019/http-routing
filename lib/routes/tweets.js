const People = require('../models/Tweets');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

const getId = url => url.pathname.slice(1).split('/')[1];

module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST' && url.pathname === '/tweets') {
    bodyParser(req)
      .then(({ name, age, favoriteColor }) => {
        Tweets.create({
          name,
          age,
          favoriteColor
        }, (err, createdPerson) => {
          res.sendWithError(err, createdPerson);
        });
      });
  } else if(req.method === 'GET' && url.pathname === '/tweet') {
    People.find((err, listOfPeople) => {
      res.sendWithError(err, listOfPeople);
    });
  } else if(req.method === 'GET' && url.pathname.includes('/tweet/')) {
    People.findById(getId(url), (err, person) => {
      res.sendWithError(err, person);
    });
  } else if(req.method === 'PUT' && url.pathname.includes('/tweet/')) {
    bodyParser(req)
      .then(({ name, age, favoriteColor }) => {
        People.findByIdAndUpdate(getId(url), {
          name,
          age,
          favoriteColor
        }, (err, updatedPerson) => {
          res.sendWithError(err, updatedPerson);
        });

      });
  } else if(req.method === 'DELETE' && url.pathname.includes('/tweet/')) {
    People.findByIdAndDelete(getId(url), (err, data) => {
      res.sendWithError(err, data);
    });
  }
};