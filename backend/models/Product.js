const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    ne: { type: String, required: true },
    en: { type: String, required: true },
  },
  slug: { type: String, required: true, unique: true },
  description: {
    ne: { type: String, required: true },
    en: { type: String, required: true },
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  finalPrice: Number,
  images: [{ url: String, isPrimary: Boolean }],
  specifications: [{
    key: { ne: String, en: String },
    value: { ne: String, en: String },
  }],
  features: {
    ne: [String],
    en: [String],
  },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, unique: true },
  warranty: { ne: String, en: String },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.pre('save', function(next) {
  this.finalPrice = this.price - (this.price * this.discountPercentage / 100);
  next();
});

module.exports = mongoose.model('Product', productSchema);