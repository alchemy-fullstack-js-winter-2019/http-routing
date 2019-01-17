const http = require('http');
const app = require('./lib/app');

http
  .createServer(app)
  .listen(7890, () => console.log('Server listening on port 7890')); // eslint-disable-line no-console
