const bodyParser = require('../bodyParser');
const { parse } = require('url');
const Tasks = require('../models/Tasks')

module.exports = (req, res ) => {
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname.includes('/tasks')) {
    bodyParser(req)
      .then(body => {
        Tasks.create({
          task: body.task,
          completed: body.completed
        }, (err, createdTask) => {
          res.end(JSON.stringify(createdTask));
        })
      })
  }
}