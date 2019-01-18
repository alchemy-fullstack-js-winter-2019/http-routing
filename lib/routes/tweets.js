const bodyParser = require('../bodyParser');
const { parse } = require('url');
const Tweets = require('../models/Tweets')

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname.includes('/tweets')) {
    bodyParser(req)
      .then(body => {
        Tweets.create({
          handle: body.handle,
          tweet: body.tweet
        },(err, createdTweet) => {
          res.end(JSON.stringify(createdTweet));
        })
      })
  }
  else if(req.method === 'GET' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findById(id, (err, foundTweet) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      }
      res.end(JSON.stringify(foundTweet));
    })
  }
  else if(req.method === 'GET' && url.pathname.includes('/tweets')) {
    Tweets.find((err, listOfTweets) => {
      res.end(JSON.stringify(listOfTweets))
    })
  }
  else if(req.method === 'PUT' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
    .then(body => {
      Tweets.findByIdAndUpdate(id, {
        handle: body.handle,
        tweet: body.tweet,
        _id: body._id
      }, (err, updatedTweet) => {
        if(err) {
          res.statusCode = 400;
          res.end(stringify(err))
        }
        res.end(JSON.stringify(updatedTweet))
      })
    })
  }
  else if(req.method === 'DELETE' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
      Tweets.findByIdAndDelete(id, (err, deletedTweet) => {
        if(err) {
          res.statusCode = 400;
          res.end(JSON.stringify(err));
        }
        else{
          res.end(JSON.stringify(deletedTweet));
        }
      })
  }
}