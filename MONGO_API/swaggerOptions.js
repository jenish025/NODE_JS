const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My Gamesses API Documentation',
    version: '1.0.0',
    description: 'This is a sample API documentation',
  },
  servers: [
    {
      url: 'http://localhost:3000/',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'x-auth-token',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: [
    './router/*.js',
    './router/UserBuyGames/*.js',
    './router/UserInfo/*.js',
    './router/UserMoney/*.js',
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
