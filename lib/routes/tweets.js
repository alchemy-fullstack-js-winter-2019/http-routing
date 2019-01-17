const bodyParser = require('../bodyParser');
const { parse } = require('url');
const Tweets = require('../models/Tweets')

module.exports = (req, res) => {
  const url = parse(req.url, true);
}