const request = require('superagent');

const getCharacters = () => {
  return request 
    .get('https://swapi.co/api/people')
    .then(res => {
      return res.body.results.map(character => {
        return {
          name: character.name,
          birthYear: character.birth_year
        };
      });
    });
};

module.exports = { getCharacters };
