const mongoose = require('mongoose');
const express = require('express');
const congfig = require('config');
const app = express();
const gameses = require('./router/games');
const home = require('./router/home');
const user = require('./router/registerUser');
const buyGames = require('./router/UserBuyGames/buyGames');
const auth = require('./router/authLogin');
const userInfo = require('./router/UserInfo/userInfo');

if (!congfig.get('jwtSecret')) {
  console.error('FATAL ERROR: jwtSecret is not defined');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/gameses')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use('/api/home', home);
app.use('/api/gameses', gameses);
app.use('/api/user/singup', user);
app.use('/api/user/login', auth);
app.use('/api/buygames', buyGames);
app.use('/api/userinfo', userInfo);

app.listen(3000, () => {
  console.log(`Product server listening on ${3000}`);
});
