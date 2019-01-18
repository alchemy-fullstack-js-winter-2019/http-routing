const http = require('http');
const app = require('./lib/app');

http
  .createServer(app)
  .listen(7890, () => console.log('LISTENING on 7890'));
  