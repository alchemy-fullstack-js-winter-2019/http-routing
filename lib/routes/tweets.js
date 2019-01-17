const Tweets = require('../../lib/models/Tweets');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);
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
  else if
  (url.pathname === '/tweets/' && req.method === 'GET') {
    Tweets.find((err, listOfTweets) => {
      res.HandleErrorAndSend(err, listOfTweets);
    });
  }
  else if
  (url.pathname.includes('/tweets/') && req.method === 'GET') {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findById(id, (err, foundTweet) => {
      res.HandleErrorAndSend(err, foundTweet);
    });
  }
  else if
  (url.pathname.includes('/tweets/') && req.method === 'PUT') {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Tweets.findByIdAndUpdate(id, {
          name: body.name,
          description: body.description,
          username: body.username,
          _id: id
        }, (err, createdTweet) => {
          res.HandleErrorAndSend(err, createdTweet);
        });
      });
  }
  else if 
  (url.pathname.includes('/tweets/') && req.method === 'DELETE') {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findByIdAndDelete(id, (err, deletedTweet) => {
      res.HandleErrorAndSend(err, deletedTweet);
    });
  }
};
