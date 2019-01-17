const { parse } = require('url');
const peopleRouter = require('../lib/routing/people');

module.exports = (req, res) => {

    const url  = parse(req.url, true);

    res.setHeader('Content-Type', 'application/json');
    if(url.pathname.includes('/people')) {
        return peopleRouter(req, res);
    } 
    //else if

};
