import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Format cart response helper
 * Calculates subtotal based on the latest MongoDB product prices
 * and flattens populated product fields for frontend ease of use
 */
const formatCartResponse = (cart) => {
  if (!cart || !cart.items) {
    return {
      success: true,
      items: [],
      subtotal: 0,
      totalCount: 0
    };
  }

  // Filter out any items whose product reference no longer exists in DB
  const validItems = cart.items.filter((item) => item.product);

  let subtotal = 0;
  let totalCount = 0;

  const items = validItems.map((item) => {
    const prod = item.product;
    const price = typeof prod.price === 'number' ? prod.price : 0;
    const itemTotal = price * item.quantity;

    subtotal += itemTotal;
    totalCount += item.quantity;

    return {
      id: prod._id.toString(),
      _id: prod._id.toString(),
      productId: prod._id.toString(),
      name: prod.name,
      category: prod.category,
      price: prod.price,
      image: prod.image,
      stock: prod.stock,
      quantity: item.quantity,
      itemTotal
    };
  });

  return {
    success: true,
    items,
    subtotal,
    totalCount
  };
};

/**
 * @desc   Get current user's shopping cart
 * @route  GET /api/cart
 * @access Private
 */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        subtotal: 0,
        totalCount: 0
      });
    }

    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

/**
 * @desc   Add a product to cart or increase quantity
 * @route  POST /api/cart
 * @access Private
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const addQty = Math.max(1, parseInt(quantity, 10) || 1);

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists in MongoDB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create cart for current user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check existing item in cart
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const currentQty = existingIndex > -1 ? cart.items[existingIndex].quantity : 0;
    const targetQty = currentQty + addQty;

    // Check product stock before updating
    if (targetQty > product.stock) {
      return res.status(400).json({
        message: `Cannot add ${addQty} more. Only ${product.stock} units available in stock (you already have ${currentQty} in cart).`,
        stock: product.stock
      });
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = targetQty;
    } else {
      cart.items.push({
        product: productId,
        quantity: targetQty
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

/**
 * @desc   Update item quantity in cart (increase / decrease)
 * @route  PUT /api/cart/:productId
 * @access Private
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const newQty = parseInt(req.body.quantity, 10);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product is not in your cart' });
    }

    // If new quantity is 0 or negative, remove the item
    if (isNaN(newQty) || newQty <= 0) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      await cart.populate('items.product');
      return res.status(200).json(formatCartResponse(cart));
    }

    // Check product stock in MongoDB before updating quantity
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (newQty > product.stock) {
      return res.status(400).json({
        message: `Cannot set quantity to ${newQty}. Maximum available stock is ${product.stock}.`,
        stock: product.stock
      });
    }

    cart.items[itemIndex].quantity = newQty;

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({
      message: 'Failed to update item quantity',
      error: error.message
    });
  }
};

/**
 * @desc   Remove a product from cart
 * @route  DELETE /api/cart/:productId
 * @access Private
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        subtotal: 0,
        totalCount: 0
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};
