const Tasks = require('../models/Tasks');
const bodyParser = require('../bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname === '/tasks') {
    bodyParser(req)
      .then(body => {
        Tasks.create({
          title: body.title,
          description: body.description,
        }, (err, createdTasks) => {
          res.sendWithError(err, createdTasks);
        });
      });
  } else if(url.pathname === '/tasks' && req.method === 'GET') {
    Tasks.find((err, listOfTasks) => {
      res.sendWithError(err, listOfTasks);
    });
  } else if(url.pathname.includes('/tasks/') && req.method === 'GET') {
    const _id = url.pathname.slice(1).split('/')[1];
    Tasks.findById(_id, (err, tasks) => {
      res.sendWithError(err, tasks);
    });
  } else if(req.method === 'PUT' && url.pathname.includes('/tasks/')) {
    const _id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(({ title, description }) => {
        Tasks.findByIdAndUpdate(_id, {
          title,
          description
        }, (err, updatedTasks) => {
          res.sendWithError(err, updatedTasks);
        });
      });
  } else if(req.method === 'DELETE' && url.pathname.includes('/tasks/')) {
    const _id = url.pathname.slice(1).split('/')[1];
    Tasks.findByIdAndDelete(_id, (err, data) => {
      res.sendWithError(err, data);
    });
  }
};
