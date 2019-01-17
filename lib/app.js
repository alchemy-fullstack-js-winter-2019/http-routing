/* eslint-disable no-console */
const peopleRoute = require('./routes/people');
const { parse } = require('url');


module.exports = (req, res) => {
  const url = parse(req.url, true);

  res.send = json => res.end(JSON.stringify(json));
  res.setHeader('Content-Type', 'application/json');

  if(url.pathname.includes('/people')) {
    return peopleRoute(req, res);
  } 
  
  else if(url.pathname.includes('/tweets')) {
    return tweetsRoute(req, res);
  } 
  
  //else {
  //   return notFound(req, res);
  // }
  
};
