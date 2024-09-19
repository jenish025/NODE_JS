const experss = require('express');
const router = experss.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

const Games = mongoose.model(
  'Gameses',
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 50 },
    price: { type: Number, required: true, min: 0 },
    isFree: {
      type: Boolean,
      required: true,
    },
    tags: {
      type: Array,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A Games should have at least one tag',
      },
      required: true,
    },
    date: { type: Date, default: Date.now },
    isReleased: {
      type: Boolean,
      required: true,
    },
    avalibalCopies: {
      type: Number,
      required: function () {
        return this.isReleased;
      },
    },
    trailer: {
      type: String,
      required: function () {
        return this.isReleased;
      },
    },
    availbalePlatforms: {
      type: Array,
      required: function () {
        return this.isReleased && this.avalibalCopies > 0;
      },
    },
  })
);

// GET /api/gameses

router.get('/', async (req, res) => {
  try {
    const gameList = await Games.find({}).limit(10).sort({ name: 1 });
    res.send(gameList);
  } catch (err) {
    res.status(404).send(err.message || 'Something went wrong');
  }
});

// GET /api/gameses/id

router.get('/:id', (req, res) => {
  const product = getProduct(parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.send(product);
});

// POST /api/products

router.post('/', async (req, res) => {
  const value = req.body;
  try {
    let newGame = new Games({
      name: value.name,
      price: value.price,
      isFree: value.isFree,
      tags: value.tags,
      isReleased: value.isReleased,
      avalibalCopies: value.avalibalCopies,
      trailer: value.trailer,
      availbalePlatforms: value.availbalePlatforms,
    });
    newGame = await newGame.save();
    res.status(200).send(newGame);
  } catch (err) {
    return res
      .status(400)
      .send(err || 'Something went wrong while creating a new game');
  }
});

// PUT /api/products/1

// router.put('/:id', (req, res) => {
//   const product = getProduct(parseInt(req.params.id));
//   if (!product) {
//     return res.status(404).send('Product not found');
//   }

//   const { error, value } = validateProduct(req.body);

//   if (error) {
//     return res.status(400).send(error.details[0].message);
//   }

//   product.name = value.name;
//   product.price = value.price;
//   res.send(product);
// });

// DELETE /api/products/1

// router.delete('/:id', (req, res) => {
//   const product = getProduct(parseInt(req.params.id));
//   if (!product) {
//     return res.status(404).send('Product not found');
//   }
//   const index = products.indexOf(product);
//   products.splice(index, 1);
//   res.send(product);
// });

// function getProduct(id) {
//   return products.find((product) => product.id === id);
// }

// function validateProduct(product) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).required(),
//     price: Joi.number().required().min(1),
//   });

//   return schema.validate(product);
// }

module.exports = router;
