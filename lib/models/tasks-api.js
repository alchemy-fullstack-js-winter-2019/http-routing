const Tasks = require('./Tasks');
const notFound = require('../routes/notFound');

module.exports = {
  getTasks() {
    if(Object.keys(Tasks).length) return Tasks;
    throw notFound;
  },

  getTask(id) {
    const task = Tasks[id];
    if(task) return task;
    throw notFound;
  },

  addTask(task) {
    const id = task.id;
    if(!id) throw notFound;
    Tasks[id] = task;
    return Tasks[id];
  },

  updateTask(id, updated) {
    if(!Tasks[id]) throw notFound;
    Tasks[id] = updated;
    return Tasks[id];
  }
};
