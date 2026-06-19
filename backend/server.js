const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/database/database');
const cors = require('cors');
const destinationRoutes = require('./src/routers/destinationRoutes');

dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/destinations', destinationRoutes);

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