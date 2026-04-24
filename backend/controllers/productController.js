const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.finalPrice = {};
    if (minPrice) filter.finalPrice.$gte = Number(minPrice);
    if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    if (search) {
      filter.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.ne': { $regex: search, $options: 'i' } },
      ];
    }
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { finalPrice: 1 };
    if (sort === 'price-desc') sortOption = { finalPrice: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    
    const skip = (page - 1) * limit;
    const products = await Product.find(filter).populate('category').sort(sortOption).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category');
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const products = await Product.find({ category: category._id, isActive: true }).populate('category');
    res.json({ category, products });
  } catch (err) { res.status(500).json({ message: err.message }); }
};