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
          tweet: body.tweet,
        }, (err, createdTweet) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          } else {
            res.end(JSON.stringify(createdTweet));
          }
        });
      });
  }

  else if(req.method === 'GET' && url.pathname === '/tweets') {
    Tweets.find((err, listOfTweets) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify(listOfTweets));
      }
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findById(id, (err, tweet) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify(tweet));
      }
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Tweets.findByIdAndUpdate(id, {
          handle: body.handle,
          tweet: body.tweet
        }, (err, updatedTweet) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          } else {
            res.end(JSON.stringify(updatedTweet));
          }
        });
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findByIdAndDelete(id, (err) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ deleted: 0 }));
      } else {
        res.end(JSON.stringify({ deleted: 1 }));
      }
    });
  }
};
