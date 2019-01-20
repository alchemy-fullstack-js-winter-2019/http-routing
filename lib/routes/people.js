const bodyParser = require('../bodyParser');
const { 
  getPeople
} = require('../models/people-api');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));

  bodyParser(req, body => {
    res.body = body;
    console.log('res.body', res.body);

    if(req.method === 'GET' && !res.subPath) {
      res.send(getPeople());
    }
    res.end();
  });
};


