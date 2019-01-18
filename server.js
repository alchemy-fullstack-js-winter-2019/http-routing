const http = require('http');
const app = require('./lib/app');


http
  .createServer(app)
  /* eslint-disable-next-line*/
  .listen(7980, () => console.log('listening on 7980'));