const { parse } = require('url');
const { getPeople } = require('./people-api');

module.exports = (req, res) => {
  console.log('CONNECTED');

  const url = parse(req.url, true);
  const pathname = url.pathname;

  if(pathname === '/people') {
    console.log(getPeople());
    res.end(JSON.stringify(getPeople()));
  }
};
