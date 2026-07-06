const dotenv = require('dotenv');
dotenv.config(); // must run before anything that depends on process.env

const express = require('express');
const connectDB = require('./src/database/database');
const cors = require('cors');
const destinationRoutes = require('./src/routers/destinationRoutes');
const userRoutes = require('./src/routers/userRoutes');
const packageRoutes = require('./src/routers/packageRoutes');
const bookingRoutes = require('./src/routers/bookingRoutes');
const transactionRoutes = require('./src/routers/transactionRoutes');
const externalRoutes = require('./src/routers/externalRoutes');
const adminRoutes = require('./src/routers/adminRoutes');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'pakshet' });
});

app.use('/api/destinations', destinationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/admin', adminRoutes);





// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();