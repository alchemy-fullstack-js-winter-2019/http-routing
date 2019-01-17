const People = require('../models/People');
const bodyParser = require('../bodyParser');
const { parse } = require('url');


const handleErrAndSend = (res, err, json) => {
  if(err) {
    res.statusCode = 400;
    res.end(JSON.stringify(err));
  } else {
    res.end(JSON.stringify(json));
  }
};

const getId = url => url.pathname.slice(1).split('/')[1];

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST') {
    bodyParser(req)
      .then(body => {
        People.create({ 
          name: body.name, 
          job: body.job,
          pets: body.pets,
        }, (err, createdPerson) => {
          // Once a person is created, the callback above fires and then we end with stringify
          handleErrAndSend(res, err, createdPerson);
        });
      });
  } 

  else if(req.method === 'PUT') {
    const id = getId(url);
    bodyParser(req)
      .then(body => {
        People.findByIdAndUpdate(id, { 
          name: body.name, 
          job: body.job, 
          pets: body.pets,
          id: body._id
        }, (err, updatedObj) => {
          handleErrAndSend(res, err, updatedObj);
        });
      });
  }

  else if(req.method === 'DELETE') {
    const id = getId(url);
    People.findByIdAndDelete(id, (err, deletedPerson) => {
      handleErrAndSend(res, err, deletedPerson);
    });
  }
  
  
  else if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = getId(url);
    People.findById(id, (err, foundPerson) => {
      handleErrAndSend(res, err, foundPerson);
    });
  }

  else if(req.method === 'GET') {
    People.find((err, allPeople) => {
      handleErrAndSend(res, err, allPeople);
    });
  } 

};