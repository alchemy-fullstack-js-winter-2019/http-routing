const tweetsRoutes = require('./routes/tweets');
const peopleRoutes = require('./routes/people');
const { parse } = require('url');
// const bodyParser = require('./bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');

  // const errOrStringify = (err, obj) => {
  //   if(err) {
  //     res.statusCode = 400;
  //     res.end(JSON.stringify(err));
  //   } else {
  //     res.end(JSON.stringify(obj));
  //   }
  // };

  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  }

  else if(url.pathname.includes('/tweets')) {
    return tweetsRoutes(req, res);
  }

  // else if(url.pathname.includes('/dogs')) {
  //   return 
  // }

};
