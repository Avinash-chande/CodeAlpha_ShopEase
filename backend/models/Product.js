import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      default: 0
    },
    category: {
      type: String,
      default: 'General'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    countInStock: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
