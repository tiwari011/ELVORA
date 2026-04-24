const Admin = require('../models/Admin');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const generateToken = require('../utils/generateToken');
const slugify = require('slugify');

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role || 'admin'
      },
      token: generateToken(admin._id, 'admin'),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;
    const recentOrders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(5);
    res.json({ totalOrders, pendingOrders, totalUsers, totalProducts, totalRevenue, recentOrders });
  } catch (err) { res.status(500).json({ message: err.message }); }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')  // Exclude password
      .sort('-createdAt');
    
    // ✅ Log to verify addresses are included
    console.log('📦 USERS WITH ADDRESSES:', users.map(u => ({
      name: u.name,
      addressCount: u.addresses?.length || 0
    })));
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  const { status, paymentMethod } = req.query;
  const filter = {};
  if (status) filter.orderStatus = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  const orders = await Order.find(filter).populate('user', 'name email phone').sort('-createdAt');
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('user', 'name email phone');
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json(order);
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Not found' });
    
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      // Restore stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
      order.cancelledAt = Date.now();
      order.cancelReason = cancelReason;
    }
    if (status === 'Delivered') order.deliveredAt = Date.now();
    order.orderStatus = status;
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addProduct = async (req, res) => {
  try {
    const data = req.body;
    if (typeof data.name === 'string') data.name = JSON.parse(data.name);
    if (typeof data.description === 'string') data.description = JSON.parse(data.description);
    if (typeof data.specifications === 'string') data.specifications = JSON.parse(data.specifications);
    if (typeof data.features === 'string') data.features = JSON.parse(data.features);
    if (typeof data.warranty === 'string') data.warranty = JSON.parse(data.warranty);
    
    data.slug = slugify(data.name.en, { lower: true }) + '-' + Date.now();
    if (!data.sku) data.sku = 'ELV-' + Date.now();
    
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f, i) => ({ url: f.path, isPrimary: i === 0 }));
    }
    
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = req.body;
    if (typeof data.name === 'string') data.name = JSON.parse(data.name);
    if (typeof data.description === 'string') data.description = JSON.parse(data.description);
    if (typeof data.specifications === 'string') data.specifications = JSON.parse(data.specifications);
    if (typeof data.features === 'string') data.features = JSON.parse(data.features);
    if (typeof data.warranty === 'string') data.warranty = JSON.parse(data.warranty);

    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f, i) => ({ url: f.path, isPrimary: i === 0 }));
    }

    // Recalculate finalPrice if price or discount changed
    if (data.price !== undefined || data.discountPercentage !== undefined) {
      const product = await Product.findById(req.params.productId);
      const price = data.price !== undefined ? Number(data.price) : product.price;
      const discount = data.discountPercentage !== undefined ? Number(data.discountPercentage) : product.discountPercentage;
      data.finalPrice = price - (price * discount / 100);
    }

    const product = await Product.findByIdAndUpdate(req.params.productId, data, { new: true });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);
  res.json({ message: 'Deleted' });
};

exports.addCategory = async (req, res) => {
  try {
    const data = req.body;
    if (typeof data.name === 'string') data.name = JSON.parse(data.name);
    if (typeof data.description === 'string') data.description = JSON.parse(data.description);
    data.slug = slugify(data.name.en, { lower: true });
    if (req.file) data.image = req.file.path;
    const category = await Category.create(data);
    res.status(201).json(category);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCategory = async (req, res) => {
  try {
    const data = req.body;
    if (typeof data.name === 'string') data.name = JSON.parse(data.name);
    if (typeof data.description === 'string') data.description = JSON.parse(data.description);
    if (req.file) data.image = req.file.path;
    const cat = await Category.findByIdAndUpdate(req.params.categoryId, data, { new: true });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
};