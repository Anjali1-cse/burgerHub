require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function createAdmin() {
  try {
    const hash = await bcrypt.hash('Admin123', 10);
    const admin = await User.create({
      name: 'admin',
      email: 'admin@gmail.com',
      password: hash,
      isAdmin: true
    });
    console.log('Admin created:', admin.id);
    process.exit();
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
