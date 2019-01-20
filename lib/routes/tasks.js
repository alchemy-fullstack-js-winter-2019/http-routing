/* eslint-disable no-console */

const Tasks = require('../models/Tasks');
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
  const url = parse(req.url, true);

  if(req.method === 'POST') {
    bodyParser(req)
      .then(body => {
        Tasks.create({
          title: body.title,
          description: body.description
        }, (err, newTask) => {
          handleErrAndSend(res, err, newTask);
        });
      });
  }

  

};
