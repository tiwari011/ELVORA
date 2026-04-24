const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  zipCode: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  addresses: [addressSchema],
  preferredLanguage: { type: String, enum: ['ne', 'en'], default: 'ne' },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function(pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model('User', userSchema);