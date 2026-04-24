const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    ne: { type: String, required: true },
    en: { type: String, required: true },
  },
  slug: { type: String, required: true, unique: true },
  image: String,
  description: { ne: String, en: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);