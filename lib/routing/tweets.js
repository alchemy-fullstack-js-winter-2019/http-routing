const Tweets = require('../models/Tweets');
const { parse } = require('url');
const bodyParser = require('../bodyParser');

module.exports = (req, res) => {
    const url = parse(req.url, true);
    
    if(req.method === 'POST' && url.pathname === '/tweets') {
        bodyParser(req)
            .then(body => {
                Tweets.create({
                    tweet : body.tweet, 
                    handle : body.handle
                }, 
                (err, createdTweet) => {
                    res.end(JSON.stringify(createdTweet));
                });
            });
    }

    else if(req.method === 'GET' && url.pathname === '/tweets') {
        Tweets.find((err, listOfTweets) => {
            res.end(JSON.stringify(listOfTweets));
        });
    }

    else if(req.method === 'GET' && url.pathname.includes('/tweets/')) {
        const id = url.pathname.slice(1).split('/')[1];

        Tweets.findById(id, (err, foundTweet) => {
            res.end(JSON.stringify(foundTweet));

        });
    }
    else if(req.method === 'PUT' && url.pathname.includes('/tweets/')) {
        const id = url.pathname.slice(1).split('/')[1];
        bodyParser(req)
            .then(body => {
                Tweets.findByIdAndUpdate(id, body, (err, updatedTweet) => {
                    res.end(JSON.stringify(updatedTweet));
                });
            });
    }
    else if(req.method === 'DELETE' && url.pathname.includes('/tweets/')) {
        const id = url.pathname.slice(1).split('/')[1];
        Tweets.findByIdAndDelete(id, (err, deletedStatus) => {
            res.end(JSON.stringify(deletedStatus));
        });
    }


};



