import Product from '../models/Product.js';

/**
 * @desc   Get all products with optional category filtering
 * @route  GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    // Filter by category if specified and not 'All'
    const filter = category && category !== 'All'
      ? { category: { $regex: new RegExp(`^${category}$`, 'i') } }
      : {};

    const products = await Product.find(filter);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * @desc   Get a single product by ID
 * @route  GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    // Check if error is due to an invalid MongoDB ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(500).json({
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};
