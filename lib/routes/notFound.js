module.exports = (req, res) => {
  res.status = 404;
  res.end(JSON.stringify('Not Found'));
};
