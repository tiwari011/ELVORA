const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const hasOrder = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: 'Delivered',
    });
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
      isVerifiedPurchase: !!hasOrder,
    });
    
    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { averageRating: avg, totalReviews: reviews.length });
    
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already reviewed' });
    res.status(500).json({ message: err.message });
  }
};

exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name').sort('-createdAt');
  res.json(reviews);
};

exports.updateReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review || review.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized' });
  Object.assign(review, req.body);
  await review.save();
  res.json(review);
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review || review.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized' });
  await review.deleteOne();
  res.json({ message: 'Deleted' });
};