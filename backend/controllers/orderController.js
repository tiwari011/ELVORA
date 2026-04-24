const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createCODOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });
    
    // Validate stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `${item.product.name.en} insufficient stock` });
      }
    }
    
    const items = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.name.en,
      image: i.product.images[0]?.url,
      quantity: i.quantity,
      price: i.price,
    }));
    
    const itemsPrice = cart.totalAmount;
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: 'COD',
      itemsPrice,
      totalPrice: itemsPrice,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
    });
    
    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const options = {
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: 'rcpt_' + Date.now(),
    };
    const rzOrder = await razorpay.orders.create(options);
    res.json({
      orderId: rzOrder.id,
      amount: rzOrder.amount,
      currency: rzOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;
    
    const sign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    
    if (sign !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });
    
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `${item.product.name.en} insufficient stock` });
      }
    }
    
    const items = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.name.en,
      image: i.product.images[0]?.url,
      quantity: i.quantity,
      price: i.price,
    }));
    
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: 'ONLINE',
      paymentDetails: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: Date.now(),
      },
      itemsPrice: cart.totalAmount,
      totalPrice: cart.totalAmount,
      orderStatus: 'Pending',
      paymentStatus: 'Completed',
    });
    
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }
    
    cart.items = [];
    await cart.save();
    
    res.status(201).json({ success: true, order });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json(order);
};