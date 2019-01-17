const { parse } = require('url');
const peopleRoutes = require('./routing/people');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');

  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  }
};
