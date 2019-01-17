const app = require('./lib/app');
const http = require('http')


http
    .createServer(app)
    .listen(5000, () => console.log('sever Listening on port 5000'));

