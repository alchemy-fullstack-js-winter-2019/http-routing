const People = require('./People');
const fs = require('fs');

const getPeople = () => Object.values(People);

const addPerson = person => {
  fs.writeFile(`${person.id}.json`, person, err => {
    if(err) throw err;
    return person;
  });
};

module.exports = {
  getPeople,
  addPerson
};
