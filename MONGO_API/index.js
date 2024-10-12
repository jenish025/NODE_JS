const mongoose = require('mongoose');
const express = require('express');
const congfig = require('config');
const swaggerUi = require('swagger-ui-express');
const app = express();
const gameses = require('./router/games');
const home = require('./router/home');
const user = require('./router/registerUser');
const buyGames = require('./router/UserBuyGames/buyGames');
const auth = require('./router/authLogin');
const userInfo = require('./router/UserInfo/userInfo');
const userMoney = require('./router/UserMoney/userwallet');
const swaggerSpec = require('./swaggerOptions');

if (!congfig.get('jwtSecret')) {
  console.error('FATAL ERROR: jwtSecret is not defined');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/gameses')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/api/home', home);
app.use('/api/gameses', gameses);
app.use('/api/user/singup', user);
app.use('/api/user/login', auth);
app.use('/api/buygames', buyGames);
app.use('/api/userinfo', userInfo);
app.use('/api/user/wallet', userMoney);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log(`Product server listening on ${3000}`);
  console.log(
    `Swagger docs are available at http://localhost:${3000}/api-docs`
  );
});
