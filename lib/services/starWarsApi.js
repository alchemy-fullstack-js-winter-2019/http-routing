const request = require('superagent');

module.exports = id => {
  return request
    .get(`https://swapi.co/api/people/${id}`)
    .then(char => {
      return {
        name: char.body.name,
        height: char.body.height,
        mass: char.body.mass,
        hair_color: char.body.hair_color,
        birth_year: char.body.birth_year
      };
    });
};
