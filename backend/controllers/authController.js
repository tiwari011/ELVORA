const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email exists' });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
      token: generateToken(user._id),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, preferredLanguage: user.preferredLanguage },
      token: generateToken(user._id),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses, preferredLanguage } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (addresses) user.addresses = addresses;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    await user.save();
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};



// Add new address
exports.addAddress = async (req, res) => {
  try {
    const { addressLine1, addressLine2, city, state, zipCode, label, country } = req.body;
    
    if (!addressLine1 || !city || !state || !zipCode) {
      return res.status(400).json({ message: 'Required: addressLine1, city, state, zipCode' });
    }

    const user = await User.findById(req.user._id);
    const isFirst = user.addresses.length === 0;

    user.addresses.push({
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      label: label || 'Home',
      country: country || 'Nepal',
      isDefault: isFirst
    });

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { addressLine1, addressLine2, city, state, zipCode, label, country } = req.body;

    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    if (addressLine1) addr.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) addr.addressLine2 = addressLine2;
    if (city) addr.city = city;
    if (state) addr.state = state;
    if (zipCode) addr.zipCode = zipCode;
    if (label) addr.label = label;
    if (country) addr.country = country;

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    if (addr.isDefault && user.addresses.length > 1) {
      user.addresses.find(a => a._id.toString() !== addressId).isDefault = true;
    }

    addr.deleteOne();
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(addressId);
    
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    user.addresses.forEach(a => a.isDefault = false);
    addr.isDefault = true;
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};