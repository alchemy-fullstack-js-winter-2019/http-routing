const People = require('./People');
const notFound = require('../routes/notFound');
const request = require('superagent');

const getFaveChar = id => {
  return request
    .get(`https://swapi.co/api/people/${id}`)
    .then(res => {
      return ({
        name: res.body.name,
        height: res.body.height,
        mass: res.body.mass,
        hairColor: res.body.hair_color,
        birthYear: res.body.birth_year
      });
    });
};

const getPeople = () => {
  if(Object.keys(People).length) return People;
  throw notFound;
};

const getPerson = id => {
  const person = People[id];
  if(person) return person;
  throw notFound;
};

const addPerson = person => {
  if(!person.id || !person.faveCharId) throw notFound;
  return getFaveChar(person.faveCharId)
    .then(faveChar => {
      person.faveChar = faveChar;
      People[person.id] = person;
      return getPerson(person.id);
    });
};

const updatePerson = (id, updated) => {
  if(!People[id] || !updated.faveCharId) throw notFound;
  return getFaveChar(updated.faveCharId)
    .then(faveChar => {
      updated.faveChar = faveChar;
      People[updated.id] = updated;
      return getPerson(updated.id);
    });
};

const deletePerson = id => {
  if(!People[id]) throw notFound;
  delete People[id];
  return { deleted: 1 };
};

const error = (req, res) => notFound(req, res);

module.exports = {
  getPeople,
  addPerson,
  getPerson,
  updatePerson,
  deletePerson,
  error
};
