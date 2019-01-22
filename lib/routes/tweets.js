const { parse }  = require('url');
const bodyParser = require('../bodyParser');
const Tweets = require('../../lib/models/Tweets');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  const throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'GET' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findById(id, (throwErrOrObj));
  }  else if(req.method === 'POST' && url.pathname.includes('/tweets')) {
    bodyParser(req)
      .then(body => {
        Tweets.create({
          name: body.name,
          age: body.age,
          favoriteFood: body.favoriteFood
        }, (throwErrOrObj));
      }); 
  }  else if(req.method === 'GET' && url.pathname.includes('/tweets')) {
    Tweets.find((throwErrOrObj));
  }
  
  else if(req.method === 'PUT' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Tweets.findByIdAndUpdate(id, {
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (throwErrOrObj));
      });
  }

  if(req.method === 'DELETE' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findByIdAndDelete(id, (throwErrOrObj));
  }
};
