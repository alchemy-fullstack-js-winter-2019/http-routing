const Tweets = require('../lib/models/Tweets');
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
  res.setHeader('Content-Type', 'application/json');
  if(req.method === 'POST' && url.pathname === '/tweets') {
    bodyParser(req) 
      .then(body => {
        Tweets.create({ 
          name: body.name,
          description: body.description,
          username: body.username
        }, (err, createdTweet) => {
          res.HandleErrorAndSend(err, createdTweet);
        });
      });
  }
};

