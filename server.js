const http = require('http');
const app = require('./lib/app');
const PORT = 7890 || process.env.PORT;

http.createServer(app)
  .listen(7890, () => console.log(`Listening on ${PORT}`));
