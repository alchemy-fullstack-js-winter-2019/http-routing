const { parse } = require('url');

module.exports = (req, res) => {
  console.log('CONNECTED');

  const url = parse(req.url, true);
  const pathname = url.pathname;

  if(pathname === '/people') {
    
  }
};
