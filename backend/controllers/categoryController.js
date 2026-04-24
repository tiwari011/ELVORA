const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
};