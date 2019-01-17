const Tweets = require('../models/Tweets');
const bodyParser = require('../bodyParser');
const { parse } = require('url');


const handleErrAndSend = (res, err, json) => {
  if(err) {
    res.statusCode = 400;
    res.end(JSON.stringify(err));
  } else {
    res.end(JSON.stringify(json));
  }
};

const getId = url => url.pathname.slice(1).split('/')[1];

module.exports = (req, res) => {
  
}