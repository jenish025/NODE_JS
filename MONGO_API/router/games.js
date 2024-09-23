const experss = require('express');
const router = experss.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

const Games = mongoose.model(
  'Gameses',
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 50 },
    price: { type: Number, min: 0 },
    isFree: { type: Boolean },
    tags: {
      type: Array,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A Games should have at least one tag',
      },
      required: true,
      set: function (v) {
        if (typeof v === 'string') {
          return v.split(',').map((tag) => tag.trim().toUpperCase());
        }
        return v.map((tag) => tag.toUpperCase());
      },
    },
    date: { type: Date, default: Date.now },
    isReleased: {
      type: Boolean,
      required: true,
    },
    avalibalCopies: {
      type: Number,
    },
    trailer: {
      type: String,
    },
    availbalePlatforms: {
      type: Array,
      set: function (v) {
        if (typeof v === 'string') {
          return v.split(',').map((tag) => tag.trim().toUpperCase());
        }
        return v.map((tag) => tag.toUpperCase());
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

// POST /api/products
router.post('/', async (req, res) => {
  const value = req.body;
  try {
    let newGame = new Games({
      name: value.name,
      price: value.price,
      isFree: value.price === 0,
      tags: value.tags,
      isReleased: value.isReleased,
      avalibalCopies: value.isReleased ? value.avalibalCopies : 0,
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

router.put('/:id', async (req, res) => {
  try {
    const upadteById = await Games.findByIdAndUpdate(req.params.id, {
      $set: {
        name: req.body.name,
        price: req.body.price,
        isFree: req.body.price === 0,
        tags: req.body.tags,
        isReleased: req.body.isReleased,
        avalibalCopies: req.body.avalibalCopies,
        trailer: req.body.trailer,
        availbalePlatforms: req.body.availbalePlatforms,
      },
    });

    res.send(upadteById);
  } catch (err) {
    return res
      .status(400)
      .send(err?.message || 'Something went wrong while updating a game');
  }
});

// GET /api/gameses/id

router.get('/:id', async (req, res) => {
  const gameById = await Games.findById(req.params.id);
  if (!gameById) {
    return res.status(404).send('Product not found');
  }
  res.send(gameById);
});

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
