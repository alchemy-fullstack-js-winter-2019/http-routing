const { parse } = require('url');
const { getPeople, addPerson } = require('./models/people-api');

module.exports = (req, res) => {
  console.log('CONNECTED');

  const url = parse(req.url, true);
  const pathname = url.pathname;

  if(req.method === 'GET' && pathname === '/people') {
    res.end(JSON.stringify(getPeople()));
  }
  else if(req.method === 'POST' && pathname === '/people') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      res.end(addPerson(data));
      // let json = null;
      // try {
      //   json = addPerson(data);
      // } catch(e) {
      //   json = e;
      // }
      // res.end(JSON.stringify(json));
    });
  }
};
