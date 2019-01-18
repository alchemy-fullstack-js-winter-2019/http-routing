
module.exports = (req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  res.end('Not found!!!');
};
