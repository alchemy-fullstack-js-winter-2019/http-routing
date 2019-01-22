/* eslint-disable no-undef */
const peopleRoutes = require('../lib/routes/people');
const catRoutes = require('../lib/routes/cats');
const tweetRoutes = require('../lib/routes/tweets');
const { parse } = require('url');
const notFound = require('../lib/routes/notFound');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  res.throwErrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

  if(url.pathname === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <html>
        <body>
          <h2> Welcome to my first HTTP app!</h2>
          <a href = "/people">View people</a><br>
          <a href="/cats">View cats</a><br>
          <a href="/tweets">View tweets</a><br>
        </body>
      </html
    `);
  } else if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  } else if(url.path.includes('/cats')) {
    return catRoutes(req, res);
  } else if(url.pathname.includes('/tweets')) {
    return tweetRoutes(req, res);
  } else {
    notFound(req, res);
  }
};
