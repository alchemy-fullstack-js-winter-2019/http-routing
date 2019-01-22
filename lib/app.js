const { parse } = require('url');
const notFound = require('./routes/notFound');
const people = require('./routes/people');
const tasks = require('./routes/tasks');

module.exports = (req, res) => {

  const url = parse(req.url, true);
  const pathname = url.pathname;

  if(pathname.includes('/people')) {
    req.subPath = pathname.split('/people')[1];
    req.id = req.subPath.split('/')[1];
    people(req, res);
  } 
  else if(pathname.includes('/tasks')) {
    req.subPath = pathname.split('/tasks')[1];
    req.id = req.subPath.split('/')[1];
    tasks(req, res);
  }
  else {
    notFound(req, res);
  }
};
