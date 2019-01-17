const bodyParser = require('../bodyParser');
const { parse } = require('url');
const Tweets = require('../models/Tweets');




module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST' && url.pathname === '/tweets') {
    bodyParser(req)
      .then(body => {
        Tweets.create({ 
          handle: body.handle, 
          text: body.text, 
        }, (err, createdTweets) => {
          res.end(JSON.stringify(createdTweets));
        });
      });
  }

  else if(req.method === 'GET' && url.pathname === '/tweets') {
    Tweets.find((err, listOfTweets) => {
      res.end(JSON.stringify(listOfTweets));
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findById(id, (err, foundTweets) => {
      res.end(JSON.stringify(foundTweets));
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Tweets.findByIdAndUpdate(id, body, (err, updatedTweets) => {
          res.end(JSON.stringify(updatedTweets));
        });
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findByIdAndDelete(id, (err, deletedTweet) => {
      res.end(JSON.stringify(deletedTweet));
    });
  }
};
