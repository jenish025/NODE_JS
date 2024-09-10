const http = require('http');

http
  .createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    if (req.url === '/') {
      res.statusCode = 200;
      res.end('Hello, World!');
    } else {
      res.statusCode = 404;
      res.end('Page Not Found');
    }
  })
  .listen(3000, 'localhost', () => {
    console.log('Server running');
  });
