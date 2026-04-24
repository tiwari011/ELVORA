require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await Admin.findOne({ email: 'admin@elvora.com' });
  if (exists) { console.log('Admin exists'); process.exit(0); }
  await Admin.create({
    username: 'admin',
    email: 'admin@elvora.com',
    password: 'Admin@123',
  });
  console.log('Admin created: admin@elvora.com / Admin@123');
  process.exit(0);
})();
