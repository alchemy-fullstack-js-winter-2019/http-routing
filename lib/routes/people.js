const bodyParser = require('../bodyParser');
const { 
  addPerson,
  getPeople,
  getPerson,
  updatePerson,
  deletePerson
} = require('../models/people-api');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.setHeader('Content-Type', 'application/json');

  bodyParser(req, body => {
    req.body = body;

    if(req.method === 'POST' && !req.subPath){
      let json = null;
      try {
        json = addPerson(req.body);
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }

    if(req.method === 'GET' && !req.subPath) {
      let json = null;
      try {
        json = getPeople();
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    } 

    if(req.method === 'GET' && req.subPath) {
      let json = null;
      try {
        json = getPerson(req.id);
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }

    if(req.method === 'PUT' && req.subPath) {
      let json = null;
      try {
        json = updatePerson(req.id, req.body);
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }

    if(req.method === 'DELETE' && req.subPath) {
      let json = null;
      try {
        json = deletePerson(req.id);
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }

  });
};


