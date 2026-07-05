const asyncHandler = require('express-async-handler');
const Booking = require('../models/booking');
const User = require('../models/user');
const Package = require('../models/packages');
const Destination = require('../models/destination');
const Transaction = require('../models/transaction');

const isAuthorizedInternalRequest = (req) => {
  const configuredKey = process.env.INTERNAL_API_KEY;
  const requestKey = req.headers['x-api-key'];

  if (!configuredKey) {
    return false;
  }

  return Boolean(requestKey) && requestKey === configuredKey;
};

const summaryStats = asyncHandler(async (req, res) => {
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
    { $group: { _id: "$packageId", packageName: { $first: "$packageName" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const mostTrendingPackage = mostTrendingPackageResult[0];

  res.json({ totalBookings, totalDestination, totalTravelerUsers, totalPackages, totalRevenue, mostTrendingPackage,  });
});


const getTransactions = asyncHandler(async (req, res) => {
  if (!isAuthorizedInternalRequest(req)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const transactions = await Transaction.find().sort({ transactionDate: -1, _id: -1 });
  res.status(200).json(transactions);
});

module.exports = {
  summaryStats,
  getTransactions,
};


