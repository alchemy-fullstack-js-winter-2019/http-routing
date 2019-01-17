const Tweets = require('../models/Tweets');
const bodyParser = require('../bodyParser');
const { parse } = require('url');


const handleErrAndSend = (res, err, json) => {
  if(err) {
    res.statusCode = 400;
    res.end(JSON.stringify(err));
  } else {
    res.end(JSON.stringify(json));
  }
};

const getId = url => url.pathname.slice(1).split('/')[1];

module.exports = (req, res) => {
  const url = parse(req.url, true);
  if(req.method === 'POST') {
    bodyParser(req)
      .then(body => {
        Tweets.create({ 
          handle: body.handle, 
          tweet: body.tweet
        }, (err, createdTweet) => {
          // Once a person is created, the callback above fires and then we end with stringify
          handleErrAndSend(res, err, createdTweet);
        });
      });
  } 

  else if(req.method === 'PUT') {
    const id = getId(url);
    bodyParser(req)
      .then(body => {
        Tweets.findByIdAndUpdate(id, { 
          handle: body.handle,
          tweet: body.tweet,
          _id: body._id
        }, (err, updatedObj) => {
          handleErrAndSend(res, err, updatedObj);
        });
      });
  }

  else if(req.method === 'GET' && url.pathname.includes('/tweets/')) {
    const id = getId(url);
    Tweets.findById(id, (err, foundTweet) => {
      handleErrAndSend(res, err, foundTweet);
    });
  }

  else if(req.method === 'GET') {
    Tweets.find((err, allTweets) => {
      handleErrAndSend(res, err, allTweets);
    });
  }

};
