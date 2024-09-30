const mongoose = require('mongoose');
const express = require('express');
const app = express();
const gameses = require('./router/games');
const home = require('./router/home');
const user = require('./router/user');
const buyGames = require('./router/buyGames');

mongoose
  .connect('mongodb://localhost/gameses')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use('/api/home', home);
app.use('/api/gameses', gameses);
app.use('/api/user', user);
app.use('/api/buygames', buyGames);

app.listen(3000, () => {
  console.log(`Product server listening on ${3000}`);
});
