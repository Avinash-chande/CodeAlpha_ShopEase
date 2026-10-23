import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * @desc   Place a new order from user's current cart
 * @route  POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    // Validate shipping address fields
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        message: 'Please provide all delivery details (full name, phone, address, city, state, PIN code)'
      });
    }

    // 1. Validate the user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: 'Your cart is empty. Please add items to your cart before placing an order.'
      });
    }

    // 2. Check product availability and stock for every item
    for (const item of cart.items) {
      const prod = item.product;

      if (!prod) {
        return res.status(400).json({
          message: 'One or more items in your cart are no longer available in the store.'
        });
      }

      if (prod.stock < item.quantity) {
        return res.status(400).json({
          message: `Product "${prod.name}" has only ${prod.stock} units remaining in stock, but you requested ${item.quantity}. Please update your cart.`
        });
      }
    }

    // 3. Calculate subtotal and totalAmount on the backend using live product prices
    const subtotal = cart.items.reduce((sum, item) => {
      const price = typeof item.product.price === 'number' ? item.product.price : 0;
      return sum + price * item.quantity;
    }, 0);

    const isFreeDelivery = subtotal >= 499;
    const deliveryFee = isFreeDelivery ? 0 : 49;
    const totalAmount = subtotal + deliveryFee;

    // Snapshot cart items for the order
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image || '',
      quantity: item.quantity
    }));

    // 4. Save the order in MongoDB
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim()
      },
      paymentMethod: paymentMethod === 'ONLINE' ? 'Online Payment' : 'Cash on Delivery',
      status: 'Processing'
    });

    // 5. Reduce product stock after successful order creation
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // 6. Clear user's cart in MongoDB after successful checkout
    cart.items = [];
    await cart.save();

    // 7. Return order confirmation
    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Server error while processing your order',
      error: error.message
    });
  }
};

/**
 * @desc   Get logged in user's order history
 * @route  GET /api/orders/my-orders
 * @access Private
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching my-orders:', error);
    res.status(500).json({
      message: 'Failed to fetch order history',
      error: error.message
    });
  }
};
