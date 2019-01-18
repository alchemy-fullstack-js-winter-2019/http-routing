const request = require('superagent');

const getCharacter = id => {
  return request
    .get(`https://swapi.co/people/${id}`)
    .then(res => ({
      name: res.body.name,
      height: res.body.height,
      mass: res.body.mass,
      hairColor: res.body.hairColor,
      birthYear: res.body.birthYear
    }));
};

const get
