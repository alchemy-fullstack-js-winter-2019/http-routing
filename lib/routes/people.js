const bodyParser = require('../bodyParser');
const { 
  addPerson,
  getPeople
} = require('../models/people-api');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.setHeader('Content-Type', 'application/json');

  bodyParser(req, body => {
    res.body = body;

    if(req.method === 'POST' && !res.subPath) res.send(addPerson(res.body));

    if(req.method === 'GET' && !res.subPath) res.send(getPeople());
  });
};


