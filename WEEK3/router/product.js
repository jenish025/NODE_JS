const experss = require('express');
const router = experss.Router();
const Joi = require('joi');

let products = [
  { id: 1, name: 'Product 1', price: 20.0 },
  { id: 2, name: 'Product 2', price: 30.0 },
];

// GET /api/products

router.get('/', (req, res) => {
  res.send(products);
});

// GET /api/products/1

router.get('/:id', (req, res) => {
  const product = getProduct(parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.send(product);
});

// POST /api/products

router.post('/', (req, res) => {
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

// PUT /api/products/1

router.put('/:id', (req, res) => {
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

// DELETE /api/products/1

router.delete('/:id', (req, res) => {
  const product = getProduct(parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Product not found');
  }
  const index = products.indexOf(product);
  products.splice(index, 1);
  res.send(product);
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

module.exports = router;
