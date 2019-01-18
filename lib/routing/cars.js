const Cars = require('../models/Cars');
const { parse } = require('url');
const bodyParser = require('../bodyParser');

module.exports = (req, res) => {
    const url  = parse(req.url, true);
    
    if(req.method === 'POST' && url.pathname === '/cars') {
        bodyParser(req)
            .then(body => {
                Cars.create({ 
                    brand: body.brand
                },
                (err, createdCar) => {
                    res.end(JSON.stringify(createdCar));
                });
            });
    }

    else if(req.method === 'GET' && url.pathname === '/cars') {
        Cars.find((err, listOfCars) => {
            res.end(JSON.stringify(listOfCars));
        });
    }
    else if(req.method === 'GET' && url.pathname.includes('/cars/')) {
        const id = url.pathname.slice(1).split('/')[1];

        Cars.findById(id, (err, foundCar) => {
            res.end(JSON.stringify(foundCar));

        });
    }
    else if(req.method === 'PUT' && url.pathname.includes('/cars/')) {
        const id = url.pathname.slice(1).split('/')[1];
        bodyParser(req)
            .then(body => {
                Cars.findByIdAndUpdate(id, body, (err, updatedCar) => {
                    res.end(JSON.stringify(updatedCar));
                });
            });
    }
    else if(req.method === 'DELETE' && url.pathname.includes('/cars/')) {
        const id = url.pathname.slice(1).split('/')[1];
        Cars.findByIdAndDelete(id, (err, deletedStatus) => {
            res.end(JSON.stringify(deletedStatus));
        });
    }

};
