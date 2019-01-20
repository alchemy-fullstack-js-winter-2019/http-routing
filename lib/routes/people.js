const People = require('../models/People')
const bodyParser = require('../bodyParser');
const { parse } = require('url');
const getFavChar = require('../services/starWarsApi')
const { getCharacter } = require('../services/starWarsApi')
module.exports = (req, res) => {
  
  const url = parse(req.url, true);

  if(req.method === 'POST' && url.pathname.includes('/people')) {
    bodyParser(req)
    .then(body => {
      getCharacter(body.favCharId)
        .then(favChar => { 
          People.create({ 
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor,
          favChar
         }, (err, createdPerson) => {
          res.end(JSON.stringify(createdPerson));
        })

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
  else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
    .then(body => {
      People.findByIdAndUpdate(id, {
        name: body.name,
        age: body.age,
        favoriteColor: body.favoriteColor,
        id: body._id,
        favCharId: body.favCharId
      }, (err, updatedPerson) => {
        if(err) {
          res.statusCode = 400;
          res.end(stringify(err));
        }
        res.end(JSON.stringify(updatedPerson))
      })
    })
  }
  else if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
      People.findByIdAndDelete(id, (err, deletedPerson) => {
        if(err) {
          res.statusCode = 400;
          res.end(JSON.stringify(err));
        }
        else{
          res.end(JSON.stringify(deletedPerson));
        }
      })
  }
  
}
