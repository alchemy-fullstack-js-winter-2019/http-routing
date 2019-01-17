const People = require('./models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');
const { getPerson } = require('./models/People');
const peopleRoutes = require('../lib/routes/people');


module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  const url = parse(req.url, true);
  const id = url.pathname.slice(1).split('/')[1];
  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, createdPerson) => {
          res.send(createdPerson);
        });  
      });
  } else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      res.send(listOfPeople);
    });
  } else if(req.method === 'GET' && url.pathname === '/people/id') {
    const id = url.slice(0).split('/')[1];
    People.findById((id, (err, foundPerson) => {
      res.send(foundPerson);
    }));

  } else if(req.method === 'PUT' && url.pathname.includes('/people/id')) {
    bodyParser(req)
      .then(({ name, age, favoriteColor }) => {
        People.findByIdAndUpdate(getId(url), {
          name,
          age,
          favoriteColor
        }, (err, updatedPerson) => {
          res.sendWithError(err, updatedPerson);
        });
      });

  } 
  // else if(req.method === 'DELETE' && url.pathname.includes(_id) {
  //   People.findByIdAndDelete(getId(url), {

  //   })
  // });
};
