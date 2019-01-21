const People = require('./People');

const getPeople = () => People;

const getPerson = id => People[id];

const addPerson = person => {
  if(!person.id) throw 'no id!';
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
