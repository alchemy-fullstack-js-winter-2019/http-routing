const request = require('superagent');

module.exports = favCharId => {
  return request 
    .get(`https://swapi.co/api/people/${favCharId}`)
      .then(res => {
        return {
          name: res.body.name,
          height: res.body.height,
          mass: res.body.mass,
          hair_color: res.body.hair_color,
          birth_year: res.body.birth_year
        }
      });
}
