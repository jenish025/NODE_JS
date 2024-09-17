const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/products')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  date: { type: Date, default: Date.now },
  tags: [String],
  isInStock: Boolean,
});

const Product = mongoose.model('Product', productSchema);
const product = new Product({
  name: '17',
  price: 5000,
  tags: ['phone', 'electronics'],
});

product
  .save()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
