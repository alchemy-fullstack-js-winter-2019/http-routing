const request = require('superagent');

const getCharacter = id => {
  return request
    .get(`https://swapi.co/api/people/${id}`)
    .then(res => ({
      name: res.body.name,
      hair_color: res.body.hair_color,
      gender: res.body.gender
    }));
};

module.exports = {
  getCharacter
};
