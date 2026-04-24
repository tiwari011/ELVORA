const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    quantity: Number,
    price: Number,
  }],
  shippingAddress: {
    name: String, phone: String, addressLine1: String, addressLine2: String,
    city: String, state: String, zipCode: String,
  },
  paymentMethod: { type: String, enum: ['COD', 'ONLINE'], required: true },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
  },
  itemsPrice: Number,
  shippingPrice: { type: Number, default: 0 },
  totalPrice: Number,
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ELV' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);