const Tasks = require('../models/Tasks');
const { parse } = require('url');
const bodyParser = require('../bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname === '/tasks') {
    bodyParser(req) 
      .then(body => {
        Tasks.create({ 
          title: body.title,
          description: body.description
        }, (err, createdTask) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          } else {
            res.end(JSON.stringify(createdTask));
          }
        });
      });
  }
  
  else if(req.method === 'GET' && url.pathname === '/tasks') {
    Tasks.find((err, listOfTasks) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify(listOfTasks));
      }
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/tasks/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tasks.findById(id, (err, task) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify(task));
      }
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/tasks/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Tasks.findByIdAndUpdate(id, {
          title: body.title,
          description: body.description
        }, (err, updatedTask) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          } else {
            res.end(JSON.stringify(updatedTask));
          }
        });
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/tasks/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tasks.findByIdAndDelete(id, (err) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ deleted: 0 }));
      } else {
        res.end(JSON.stringify({ deleted: 1 }));
      }
    });
  }
};
