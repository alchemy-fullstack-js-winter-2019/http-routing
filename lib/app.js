const tweetRoutes = require('./routes/tweets');
const peopleRoutes = require('./routes/people');
const dogRoutes = require('./routes/dogs');
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
  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  } else if(url.pathname.includes('/tweets')) {
    return tweetRoutes(req, res);
  } else if(url.pathname.includes('/dogs')) {
    return dogRoutes(req, res);
  }
  else {
    notFound(req, res);
  }
};
