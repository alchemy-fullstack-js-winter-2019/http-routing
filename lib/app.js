const People = require('./models/People');
const { parse } = require('url');
const bodyParser = require('./bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json')
  
  if(req.method === 'POST' && url.pathname.includes('/people')) {
    bodyParser(req)
      .then(body => {
        People.create({ 
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
         }, (err, createdPerson) => {
          res.end(JSON.stringify(createdPerson));
        })
      })
  } 
  else if(req.method === 'GET' && url.pathname.includes('/people/')){
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (err, foundPerson) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      }
      res.end(JSON.stringify(foundPerson))
    })
  }
  else if(req.method === 'GET' && url.pathname.includes('/people')) {
    People.find((err, listOfPeople) => {
      res.end(JSON.stringify(listOfPeople))
    })
  } 
  // else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
  //   People.findByIdAndUpdate(id, (err, updatedPerson) => {
  //     res.end(JSON.stringify(updatedPerson))
  //   })
  // }

};