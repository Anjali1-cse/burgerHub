require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const burgerRoutes = require('./routes/burgers');
const toppingRoutes = require('./routes/toppings');
// const orderRoutes = require('./routes/orders');
const burgerToppingRoutes = require('./routes/burgerToppings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/burgers', burgerRoutes);
app.use('/api/toppings', toppingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/burger-toppings', burgerToppingRoutes);

// app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/ping', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Unable to start server:', err);
  }
};

startServer();
