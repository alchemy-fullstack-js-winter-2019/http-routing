const bodyParser = require('../bodyParser');
const { parse } = require('url');
const Tasks = require('../models/Tasks');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname.includes('/tasks')) {
    bodyParser(req)
      .then(body => {
        Tasks.create({
          task: body.task,
          completed: body.completed
        }, (err, createdTask) => {
          res.end(JSON.stringify(createdTask));
        });
      });
  }
  else if(req.method === 'GET' && url.pathname.includes('/tasks/')){
    const id = url.pathname.slice(1).split('/')[1];
    Tasks.findById(id, (err, foundTask) => {
      if(err) {
        res.statusCod = 400;
        res.end(JSON.stringify(err));
      }
      res.end(JSON.stringify(foundTask));
    });
  }
  else if(req.method === 'GET' && url.pathname.includes('/tasks')) {
    Tasks.find((err, listOfTasks) => {
      res.end(JSON.stringify(listOfTasks));
    });
  }
  else if(req.method === 'PUT' && url.pathname.includes('/tasks/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Tasks.findByIdAndUpdate(id, {
          task: body.task,
          completed: body.completed,
          _id: body._id
        }, (err, updatedTask) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          }
          res.end(JSON.stringify(updatedTask));
        });
      });
  }
  else if(req.method === 'DELETE' && url.pathname.includes('/tasks/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tasks.findByIdAndDelete(id, (err, deletedTask) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      }
      else {
        res.end(JSON.stringify(deletedTask));
      }
    });

  }

};
