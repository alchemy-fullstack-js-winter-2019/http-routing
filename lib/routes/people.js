const bodyParser = require('../bodyParser');
const { 
  addPerson,
  getPeople,
  getPerson,
  updatePerson
} = require('../models/people-api');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.setHeader('Content-Type', 'application/json');

  bodyParser(req, body => {
    req.body = body;

    if(req.method === 'POST' && !req.subPath) res.send(addPerson(req.body));

    if(req.method === 'GET' && !req.subPath) res.send(getPeople());

    if(req.method === 'GET' && req.subPath) res.send(getPerson(req.id));

    if(req.method === 'PUT' && req.subPath) res.send(updatePerson(req.id, req.body));
  });
};


