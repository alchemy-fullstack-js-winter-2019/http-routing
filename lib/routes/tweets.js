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
}