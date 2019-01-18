const People = require('./models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');



module.exports = (req, res) => {
  const url = parse(req.url, true);
  
  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'POST' && url.pathname === '/people') {
    bodyParser(req)
      .then(body => {
        People.create({ 
          name: body.name, 
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, createPerson) => {
          res.end(JSON.stringify(createPerson));
        });
      });

  } else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      res.end(JSON.stringify(listOfPeople));
    });
  
  } else if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const _id = url.pathname.slice(1).split('/')[1];

    People.findById(_id, (err, foundPerson) => {
      res.end(JSON.stringify(foundPerson));
    });
  } else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const _id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        People.findByIdAndUpdate(_id, body, (err, updatedPerson) => {
          console.log('This somthing is', updatedPerson);
          res.end(JSON.stringify(updatedPerson));
        
        });
      });
  }
};
