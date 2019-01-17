const People = require('../lib/models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.HandleErrorAndSend = (err, json) => {
    if(err) {
      res.statusCode = 500;
      res.send(err);
    } else {
      res.send(json); 
    }
  };
  const url = parse(req.url, true);
};

