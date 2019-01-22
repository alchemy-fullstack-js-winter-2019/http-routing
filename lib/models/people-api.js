const People = require('./People');
const notFound = require('../routes/notFound');

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
  if(!person.id) throw notFound;
  People[person.id] = person;
  return getPerson(person.id);
};

const updatePerson = (id, updated) => {
  if(!People[id]) throw notFound;
  People[id] = updated;
  return getPerson(id);
};

const deletePerson = id => {
  if(!People[id]) throw notFound;
  delete People[id];
  return { deleted: 1 };
};

module.exports = {
  getPeople,
  addPerson,
  getPerson,
  updatePerson,
  deletePerson
};
