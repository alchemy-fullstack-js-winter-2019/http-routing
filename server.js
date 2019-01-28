const app = require('./lib/app');
const http = require('http');

http
  .createServer(app)
  // eslint-disable-next-line no-console
  .listen(7890, () => console.log('Listening on 7890'));


