const peopleRoutes = require('./routes/people');
const { parse } = require('url');
const notFound = require('../lib/routes/notFound');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  res.throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  } else {
    notFound(req, res);
  }

};
