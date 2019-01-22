const request = require('superagent');

const getCharacter = id => {
  return request 
    .get(`https://swapi.co/api/people/${id}`)
    .then(res => {
      return {
        name: res.body.name,
        birthYear: res.body.birth_year
      };
    });
};

module.exports = { getCharacter };
