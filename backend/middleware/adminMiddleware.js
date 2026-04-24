const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) return res.status(401).json({ message: 'Unauthorized' });
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};