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

  else if(req.method === 'GET') {
    Tasks.find((err, taskList) => {
      handleErrAndSend(res, err, taskList);
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/tasks/')) {
    const id = getId(url);
    Tasks.findById(id, (err, foundTask) => {
      handleErrAndSend(res, err, foundTask);
    });
  }

  else if(req.method === 'PUT') {
    const id = getId(url);
    bodyParser(req)
      .then(body => {
        Tasks.findByIdAndUpdate(id, {
          title: body.title,
          description: body.description,
          _id: id
        }, (err, updatedTask) => {
          handleErrAndSend(res, err, updatedTask);
        });

      });
  }

};
