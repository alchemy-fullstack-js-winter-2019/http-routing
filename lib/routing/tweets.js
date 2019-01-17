const Tweets = require('../models/Tweets');
const { parse } = require('url');
const bodyParser = require('../bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname === '/tweets') {
    bodyParser(req)
      .then(body => {
        Tweets.create({
          handle: body.handle,
          message: body.message
        }, (err, createdTweet) => {
          res.end(JSON.stringify(createdTweet));
        });
      });
  }
  else if(req.method === 'GET' && url.pathname === '/tweets') {
    
  }
};
