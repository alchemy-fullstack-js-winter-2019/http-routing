const People = require('./models/People');
const { parse } = require('url');
const bodyParser = require('./bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  
  res.setHeader('Content-Type', 'application/json');
  
  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req) 
      .then(body => {
        //creating people objects in our data/people directory
        People.create({ 
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, createdPerson) => {
          res.end(JSON.stringify(createdPerson));
        });
      });
  }
  
  else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      // listOfPeople.map(person => {
      //   console.log(person);
      //   return {
      //     name: person.name,
      //     age: person.age,
      //     favoriteColor: person.favoriteColor

      //   };
      // });
      res.end(JSON.stringify(listOfPeople));
    });
  }
};
