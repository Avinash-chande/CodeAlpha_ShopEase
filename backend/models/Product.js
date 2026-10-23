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
      required: [true, 'Please provide a product description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      default: 0
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image URL']
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      default: 'General'
    },
    stock: {
      type: Number,
      required: [true, 'Please provide product stock quantity'],
      default: 0
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    badge: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Map virtual 'id' to '_id' in JSON output
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
