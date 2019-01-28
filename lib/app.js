const { parse } = require('url');
const peopleRoutes = require('./routing/people');
const tweetsRoutes = require('./routing/tweets');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');

  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  }
  else if(url.pathname.includes('/tweets')) {
    return tweetsRoutes(req, res);
  }
};
