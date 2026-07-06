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


const Booking = require('./src/models/booking');
const Package = require('./src/models/packages');
const User = require('./src/models/user');
const Destination = require('./src/models/destination');
const Transaction = require('./src/models/transaction');

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


const isAuthorizedInternalRequest = (req) => {
  const apiKey = req.headers['x-api-key'];
  return apiKey && apiKey === process.env.INTERNAL_API_KEY;
}

app.get("/api/external/summary", async (req, res) => {
  

   if (!isAuthorizedInternalRequest(req)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const totalBookings = await Booking.countDocuments();
  const totalPackages = await Package.countDocuments();
  const totalTravelerUsers = await User.countDocuments({ role: 'traveler' });
  const totalDestination = await Destination.countDocuments();
  
  const revenueResult = await Transaction.aggregate([
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
  ]);
  const totalRevenue = revenueResult[0]?.totalAmount || 0;

  const mostTrendingPackageResult = await Booking.aggregate([
    { $group: {  packageName: { $first: "$packageName" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const mostTrendingPackage = mostTrendingPackageResult[0];

  res.json({ totalBookings, totalDestination, totalTravelerUsers, totalPackages, totalRevenue, mostTrendingPackage,  });
});

app.get("/api/external/transactions", async (req, res) => {
  // API key check
 if (!isAuthorizedInternalRequest(req)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const transactions = await Transaction.find().sort({ transactionDate: -1, _id: -1 });
  res.status(200).json(transactions);
});




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