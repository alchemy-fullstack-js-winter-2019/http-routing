const { parse } = require('url');
const people = require('./routes/people');
const notFound = require('./routes/notFound');

module.exports = (req, res) => {

  const url = parse(req.url, true);
  const pathname = url.pathname;

  if(pathname.includes('/people')) {
    req.subPath = pathname.split('/people')[1];
    req.id = req.subPath.split('/')[1];
    people(req, res);
  } else {
    notFound(req, res);
  }
};
