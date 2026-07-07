const asyncHandler = require('express-async-handler');
const Booking = require('../models/booking');
const User = require('../models/user');
const Package = require('../models/packages');
const Destination = require('../models/destination');
const Transaction = require('../models/transaction');



const summaryStats = asyncHandler(async (req, res) => {
  

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
    { $match: { status: "Completed" } },
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


  res.json({ totalBookings, totalDestination, totalTravelerUsers, totalPackages, totalRevenue, trendingPackageDetails, paymentMethods, bookingStatus });
});



module.exports = {
  summaryStats
 
};


