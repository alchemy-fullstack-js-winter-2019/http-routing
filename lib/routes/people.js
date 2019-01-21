const bodyParser = require('../bodyParser');
const { 
  addPerson,
  getPeople,
  getPerson
} = require('../models/people-api');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.setHeader('Content-Type', 'application/json');

  bodyParser(req, body => {
    res.body = body;

    if(req.method === 'POST' && !req.subPath) res.send(addPerson(res.body));

    if(req.method === 'GET' && !req.subPath) res.send(getPeople());

    if(req.method === 'GET' && req.subPath) res.send(getPerson(req.subPath.split('/')[1]));
  });
};


