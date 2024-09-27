const express = require('express');
const app = express();
const product = require('./router/product');
const home = require('./router/home');
const requestLogger = require('./middleware/apiLog');
const helmet = require('helmet');

app.use(requestLogger);
app.use(helmet());
app.use(express.json());
app.use('/api/home', home);
app.use('/api/product', product);

app.listen(3000, () => {
  console.log(`Product server listening on ${3000}`);
});
