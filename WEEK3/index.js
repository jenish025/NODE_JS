const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

let products = [
  { id: 1, name: 'Product 1', price: 20.0 },
  { id: 2, name: 'Product 2', price: 30.0 },
];

app.get('/home', (req, res) => {
  res.send('Welcome to the product server');
});

app.get('/api/product', (req, res) => {
  res.send(products);
});

app.get('/api/product/:id', (req, res) => {
  const product = getProduct(parseInt(req.params.id));
  if (!product) {
    res.status(404).send('Product not found');
  }
  res.send(product);
});

app.post('/api/product', (req, res) => {
  const { error, value } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
  };
  products.push(product);
  res.send(product);
});

app.put('/api/product/:id', (req, res) => {
  const product = getProduct(parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Product not found');
  }

  const { error, value } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  product.name = value.name;
  product.price = value.price;
  res.send(product);
});

app.listen(3000, () => {
  console.log(`Product server listening on ${3000}`);
});

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().required().min(1),
  });

  return schema.validate(product);
}
