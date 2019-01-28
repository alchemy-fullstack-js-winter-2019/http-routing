module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 404;
  res.end('Not found!!!');
};
