const request = require('superagent');

const charById = id => {
    return request
        .get(`https://swapi.co/api/people/${id}`)
        .then(res => {
            return {
                name: res.body.name, 
                height: res.body.height, 
                mass: res.body.mass, 
                eyeColor: res.body.eye_color
            };
        });
};

console.log(charById(3));


module.exports = charById;


