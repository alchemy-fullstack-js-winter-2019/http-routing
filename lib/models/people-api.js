const People = require('./People');
// const fs = require('fs');

const getPeople = () => People;

const getPerson = id => People[id];

const addPerson = person => {
  if(!person.id) throw 'no id!';
  // return fs.writeFile(`${person.id}.json`, JSON.stringify(person), err => {
  // if(err) throw err;
  People[person.id] = person;
  return getPerson(person.id);
  // });
};

const updatePerson = (id, updated) => {
  People[id] = updated;
  return getPerson(id);
};

module.exports = {
  getPeople,
  addPerson,
  getPerson,
  updatePerson
};
