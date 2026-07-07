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
  // if (!isAuthorizedInternalRequest(req)) {
  //   return res.status(401).json({ success: false, message: "Unauthorized" });
  // }

  const totalBookings = await Booking.countDocuments();
  const totalPackages = await Package.countDocuments();
  const totalTravelerUsers = await User.countDocuments({ role: 'traveler' });
  const totalDestination = await Destination.countDocuments();
  
  const revenueResult = await Transaction.aggregate([
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
  ]);
  const totalRevenue = revenueResult[0]?.totalAmount || 0;

  const trendingPackages = await Booking.aggregate([
   
    { $group: { _id: "$packageName", count: { $sum: 1 } } },

  ]);


  const trendingPackageDetails = trendingPackages.reduce((acc, package) => {
    acc[package._id] = package.count;
    return acc;
  }, {});


  const totalPaymentMethods = await Transaction.aggregate([
    { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
  ]);


  const paymentMethods = totalPaymentMethods.reduce((acc, method) => {
    acc[method._id] = method.count;
    return acc;
  }, {});
  

  const totalBookingStatus= await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const bookingStatus = totalBookingStatus.reduce((acc, status) => {
    acc[status._id] = status.count;
    return acc;
  }, {});

 
  

  res.json({ success: true, data: { totalBookings, totalDestination, totalTravelerUsers, totalPackages, totalRevenue, trendingPackageDetails, paymentMethods, bookingStatus     } });
});


const getTransactions = asyncHandler(async (req, res) => {
  // if (!isAuthorizedInternalRequest(req)) {
  //   return res.status(401).json({ success: false, message: "Unauthorized" });
  // }



  const transactions = await Transaction.find().select("_id userName packageName amount type status paymentMethod transactionDate").sort({ transactionDate: -1, _id: -1 });
  res.status(200).json({ success: true, data: transactions });
});

module.exports = {
  summaryStats,
  getTransactions,
};