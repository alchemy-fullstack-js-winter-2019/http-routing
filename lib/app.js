const peopleRoutes = require('./routes/people');
const { parse } = require('url');

module.exports = (req, res) => {
  res.send = json => res.end(JSON.stringify(json));
  res.sendWithError = (err, json) => {
    if(err) {
      res.statusCode = 400;
      res.send(err);
    } else {
      res.send(json);
    }
  };

  const url = parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');
  if(url.pathname.includes('/people')) {
    return peopleRoutes(req, res);
  } else if(url.pathname.includes('/tweets')) {
    return tweetsRoutes(req, res);
  } else {
    notFound(req, res);
  }
};
    
  } else  if(req.method === 'GET' && url.pathname.includes('/people/')
    const id = url.slice(0).split('/')[1]
      People.findById(_id, (err, person) => {
        res.sendWithError(err, person);
    });
  });

  else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
      const id = url.pathname.slice(1).split('/')[1];
        People.findByIdAndUpdate(id, {
           name: 'jroc',
           age: '21', 
           favoriteColor: 'partyred' 
        }, (err, updatedPerson) => {
          res.sendWithError(err, updatedPerson);
        });

  } else if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1]
      People.findByIdAndDelete(id, (err, data) => {
        res.end(JSON.stringify(data));
    });
  }
};
