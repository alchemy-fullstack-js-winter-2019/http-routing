const People = require('./People');
const fs = require('fs');
// const request = require('superagent');

const getPeople = () => Object.values(People);

const addPerson = person => {
  return fs.writeFile(`${person.id}.json`, person, err => {
    if(err) throw err;
    People[JSON.stringify(person.id)] = person;
    return person;
  });
};

module.exports = {
  getPeople,
  addPerson
};

// request
//   .post('http://localhost:7890/people')
//   .send({ id: 9 })
//   .then(result => console.log('result', result, People));
