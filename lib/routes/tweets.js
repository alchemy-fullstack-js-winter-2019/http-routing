const Tweets = require('../models/Tweets');
const { parse } = require('url');
const bodyParser = require('../bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');

  const errOrStringify = (err, obj) => {
    if(err) {
      res.statusCode = 400;
      res.end(JSON.stringify(err));
    } else {
      res.end(JSON.stringify(obj));
    }
  };

  if(req.method === 'GET' && url.pathname.includes('/tweets/')){
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findById(id, errOrStringify);
  }

  else if(req.method === 'POST' && url.pathname.includes('/tweets')) {
    bodyParser(req)
      .then(body => {
        Tweets.create({
          _id: expect.any(String),
          handle: body.handle,
          tweet: body.tweet
        }, errOrStringify);
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findByIdAndDelete(id, errOrStringify);
  }
  
  else if(req.method === 'PUT' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findByIdAndUpdate(id, { handle: 'yogurt420', tweet: 'yolo!' }, errOrStringify);
  }

  else if(req.method === 'GET' && url.pathname.includes('/tweets')) {
    Tweets.find(errOrStringify);
  }

};
