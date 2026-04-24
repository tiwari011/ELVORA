const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1, default: 1 },
    price: Number,
  }],
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);