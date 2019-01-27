const peopleRoutes = require('./routing/people');
const { parse } = require('url');
const notFound = require('./routing/notFound');

const resources = { 
  peopleRoutes
};

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

};

const url = parse
;
