const request = require('superagent');

const getCharacter = id => {
  return request
    .get(`https://swapi.co/api/people/${id}`)
    .then(res => {
      return {
        name: res.body.name,
        height: res.body.height,
        hairColor: res.body.hair_color
      };});
};

module.exports = { getCharacter };
