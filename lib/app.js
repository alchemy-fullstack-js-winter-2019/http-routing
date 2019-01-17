const People = require('./models/People');
const bodyParser = require('./bodyParser');
const { parse } = require('url');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  const throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

  // GET /people/:id returns a person with :id
  if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (throwErrOrObj));
  }

  // POST /people creates a new person and sends back json
  else if(req.method === 'POST' && url.pathname.includes('/people')) {
    bodyParser(req)
      .then(body => {
        People.create({
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (throwErrOrObj));
      }); 
  } 

  // GET /people returns a list of people
  else if(req.method === 'GET' && url.pathname.includes('/people')) {
    People.find((throwErrOrObj));
  }

  // PUT /people/:id updates a person with :id and returns the update
  // else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
  //   People.findByIdAndUpdate(id, (throwErrOrObj));
  //   console.log(id);
  // }

};
