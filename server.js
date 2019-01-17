/* eslint-disable no-console */
const app = require('./lib/app');
const http = require('http');

http.createServer(app)
  .listen(7890, () => console.log('Listening on 7890'));
