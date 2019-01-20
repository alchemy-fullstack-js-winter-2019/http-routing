const People = require('./People');
// const fs = require('fs');
// const request = require('superagent');

const getPeople = () => People;

const getPerson = id => People[id];

const addPerson = person => {
  // return fs.writeFile(`${person.id}.json`, JSON.stringify(person), err => {
  // if(err) throw err;
  if(!person.id) throw 'no id!';
  People[person.id] = person;
  return getPerson(person.id);
  // });
};

module.exports = {
  getPeople,
  addPerson
};
