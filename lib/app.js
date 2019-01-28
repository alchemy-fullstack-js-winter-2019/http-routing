const tweetsRoutes = require('./routes/tweets');
const peopleRoutes = require('./routes/people');
const dogsRoutes = require('./routes/dogs');
const notFoundRoutes = require('./routes/notFound');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');

  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  }

  else if(url.pathname.includes('/tweets')) {
    return tweetsRoutes(req, res);
  }

  else if(url.pathname.includes('/dogs')) {
    return dogsRoutes(req, res);
  }

  else {
    return notFoundRoutes(req, res);
  }
};
