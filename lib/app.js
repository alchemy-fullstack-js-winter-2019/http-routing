const { parse } = require('url');
const peopleRoutes = require('./routes/people');
const tweetRoutes = require('./routes/tweets');

module.exports = (req, res) => {
  // const res.send(JSON.stringify) =>
  // const handleErrSend = (res, err, json) => {
  //   if(err) {
  //     res.statusCode = 400

  //   }
  // }
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json')
  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  }
  if(url.pathname.includes('/tweets')) {
    return tweetRoutes(req, res);
  }
};