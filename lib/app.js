const People = require('./models/People');
const Tweets = require('./models/Tweets');
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
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          }
          else {
            res.end(JSON.stringify(createdPerson));
          }
        });
      });
  }
  
  else if(req.method === 'GET' && url.pathname === '/people') {
    People.find((err, listOfPeople) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      }
      else {
        res.end(JSON.stringify(listOfPeople));
      }
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (err, person) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      }
      else {
        res.end(JSON.stringify(person));
      }
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        People.findByIdAndUpdate(id, {
          name: body.name,
          age: body.age,
          favoriteColor: body.favoriteColor
        }, (err, updatedPerson) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          }
          else {
            res.end(JSON.stringify(updatedPerson));
          }
        });
      });
  }

  else if(req.method === 'DELETE' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndDelete(id, (err) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ deleted: 0 }));
      }
      else {
        res.end(JSON.stringify({ deleted: 1 }));
      }
    });
  }

  else if(req.method === 'POST' && url.pathname === '/tweets') {
    bodyParser(req) 
      .then(body => {
        //creating tweet objects in our data/tweets directory
        Tweets.create({ 
          handle: body.handle,
          tweet: body.tweet,
        }, (err, createdTweet) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          }
          else {
            res.end(JSON.stringify(createdTweet));
          }
        });
      });
  }

  else if(req.method === 'GET' && url.pathname === '/tweets') {
    Tweets.find((err, listOfTweets) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      }
      else {
        res.end(JSON.stringify(listOfTweets));
      }
    });
  }

  else if(req.method === 'GET' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    Tweets.findById(id, (err, tweet) => {
      if(err) {
        res.statusCode = 400;
        res.end(JSON.stringify(err));
      }
      else {
        res.end(JSON.stringify(tweet));
      }
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/tweets/')) {
    const id = url.pathname.slice(1).split('/')[1];
    bodyParser(req)
      .then(body => {
        Tweets.findByIdAndUpdate(id, {
          handle: body.handle,
          tweet: body.tweet
        }, (err, updatedTweet) => {
          if(err) {
            res.statusCode = 400;
            res.end(JSON.stringify(err));
          }
          else {
            res.end(JSON.stringify(updatedTweet));
          }
        });
      });
  }

};
