const People = require('./People');
const fs = require('fs');
const request = require('superagent');

const getPeople = () => Object.values(People);

const addPerson = person => {
  console.log('api data', person);
  fs.writeFile(`${person.id}.json`, JSON.stringify(person), err => {
    if(err) throw err;
    return person;
  });
};

module.exports = {
  getPeople,
  addPerson
};

request
  .get('http://localhost:7890/people')
  .then(result => console.log('result', result.text));
