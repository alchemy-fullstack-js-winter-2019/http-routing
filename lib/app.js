const peopleRoutes = require('./routes/people');
const tweetsRoutes = require('./routes/tweets');
const animalsRoutes = require('./routes/animals');
const notFoundRoute = require('./routes/notFound');
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
  else if(url.pathname.includes('/animals')) {
    return animalsRoutes(req, res);
  }
  else {
    return notFoundRoute(req, res);
  }
};
