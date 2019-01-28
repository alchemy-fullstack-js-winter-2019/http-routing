const app = require('./lib/app');
const http = require('./lib/app');

http
  .createServer(app)
  .listen(7890, () => console.log('Listening on 7890'));