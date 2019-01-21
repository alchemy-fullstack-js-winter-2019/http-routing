const notFound = require('../routes/notFound');

const People = require('./People');

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
  People[id] = updated;
  return getPerson(id);
};

const deletePerson = id => {
  if(!People[id]) throw 'id does not exist!';
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
