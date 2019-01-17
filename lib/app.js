const peopleRoutes = require('./routes/people');
const { parse } = require('url');


module.exports = (req, res) => {
  const url = parse(req.url, true); //parsing the URL and query string into an object

  res.setHeader('Content-Type', 'application/json'); //convert header into JSON 
  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  }
};
