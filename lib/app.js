const { parse } = require('url');
const peopleRoutes = require('./routes/people');
const tweetsRoutes = require('./routes/tweets');
const guitarsRoutes = require('./routes/guitars');




module.exports = (req, res) => {
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');
  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  } else if(url.pathname.includes('/tweets')) {
    return tweetsRoutes(req, res);
  } else if(url.pathname.includes('/guitars')) {
    return guitarsRoutes(req, res);
  }

};
