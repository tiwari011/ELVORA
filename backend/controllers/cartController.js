const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) cart.items[idx].quantity += quantity;
    else cart.items.push({ product: productId, quantity, price: product.finalPrice });
    
    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) { cart.items = []; await cart.save(); }
  res.json({ message: 'Cart cleared' });
};