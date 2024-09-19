const { required } = require('joi');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/products')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 10 },
  price: {
    type: Number,
    required: function () {
      return this.isInStock;
    },
  },
  date: { type: Date, default: Date.now },
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'A product should have at least one tag',
    },
  },
  isInStock: Boolean,
});

const Product = mongoose.model('Product', productSchema);

async function createProduct() {
  try {
    const product = new Product({
      name: 'Iphone 12',
      price: 5000,
      tags: ['phone', 'electronics'],
      isInStock: true,
    });

    const result = await product.save();
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

const getProductsList = async () => {
  try {
    const productList = await Product.find({})
      .limit(10)
      .sort({ name: 1 })
      .select({ name: 1, price: 1 });
    console.log(productList);
  } catch (err) {
    console.log(err.message);
  }
};

const updateProduct = async (id) => {
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name: 'Iphone 13',
          price: 6000,
          tags: ['phone', 'electronics', 'new', '2024'],
        },
      },
      { new: true }
    );

    console.log(product);
  } catch (err) {
    console.log(err.message);
  }
};
const removeProduct = async (id) => {
  try {
    const product = await Product.deleteOne({ _id: id });

    console.log(product);
  } catch (err) {
    console.log(err.message);
  }
};
createProduct();
// getProductsList();
// updateProduct('66e919ca4166e4ded6810986');
// removeProduct('66e919ca4166e4ded6810986');
