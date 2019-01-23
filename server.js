const http = require('http');
const app = require('./lib/app');
const PORT = 7890;

http.createServer(app)
  .listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));
