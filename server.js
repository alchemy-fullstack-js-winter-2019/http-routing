const app = require('./lib/app');
const http = require('http');

http
  .createServer(app)
  .listen(7890, () => console.log('listening on 7890'));
