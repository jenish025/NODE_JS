const mongoose = require('mongoose');
const express = require('express');
const app = express();
const gameses = require('./router/games');
const home = require('./router/home');

mongoose
  .connect('mongodb://localhost/gameses')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use('/api/home', home);
app.use('/api/gameses', gameses);

app.listen(3000, () => {
  console.log(`Product server listening on ${3000}`);
});
