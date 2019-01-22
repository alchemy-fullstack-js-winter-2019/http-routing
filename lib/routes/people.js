const bodyParser = require('../bodyParser');
const { 
  addPerson,
  getPeople,
  getPerson,
  updatePerson,
  deletePerson,
  error
} = require('../models/people-api');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.setHeader('Content-Type', 'application/json');

  bodyParser(req, body => {
    req.body = body;

    if(req.method === 'POST' && !req.subPath){
      try {
        addPerson(req.body)
          .then(person => res.send(person));
      } catch(err) {
        err(req, res);
      }
    }

    else if(req.method === 'GET' && !req.subPath) {
      let json = null;
      try {
        json = getPeople();
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    } 

    else if(req.method === 'GET' && req.subPath) {
      let json = null;
      try {
        json = getPerson(req.id);
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }

    else if(req.method === 'PUT' && req.subPath) {
      try {
        updatePerson(req.id, req.body)
          .then(person => res.send(person));
      } catch(err) {
        err(req, res);
      }
    }

    else if(req.method === 'DELETE' && req.subPath) {
      let json = null;
      try {
        json = deletePerson(req.id);
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }

    else {
      error(req, res);
    }
  });
};


