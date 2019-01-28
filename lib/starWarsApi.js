const request = require('superagent');

function getCharacter(id) {
  return request
    .get(`https://swapi.co/api/people/${id}`)
    .then(res => ({
      name: res.body.name,
      height: res.body.height,
      status: res.body.status,
      mass: res.body.mass,
      hairColor: res.body.hairColor,
      birthYear: res.body.birthYear
    }));
}

module.exports = { getCharacter };
