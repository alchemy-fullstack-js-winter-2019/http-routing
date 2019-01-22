const bodyParser = require('../bodyParser');
const {
  addTask,
  getTasks,
  getTask,
  updateTask
} = require('../models/tasks-api');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.setHeader('Content-Type', 'application/json');

  bodyParser(req, body => {
    req.body = body;

    if(req.method === 'POST' && !req.subPath) {
      let json = null;
      try {
        json = addTask(req.body);
      } catch(err) {
        err(req, res);
      }
      res.send(json); 
    }

    if(req.method === 'GET' && !req.subPath) {
      let json = null;
      try {
        json = getTasks();
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }

    if(req.method === 'GET' && req.subPath) {
      let json = null;
      try {
        json = getTask(req.id);
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }

    if(req.method === 'PUT' && req.subPath) {
      let json = null;
      try {
        json = updateTask(req.id, req.body);
      } catch(err) {
        err(req, res);
      }
      res.send(json);
    }
  });
};
