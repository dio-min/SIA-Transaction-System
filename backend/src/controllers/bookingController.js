const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const User = require('../models/user');
const Package = require('../models/packages');

const createBooking = asyncHandler(async (req, res) => {
  const {
    userId,
    packageId,
    packageName,
    travelDate,
    travelersCount,
    fullName,
    phone,
  } = req.body;

  if (!userId || !packageId || !packageName || !travelDate || !travelersCount || !fullName || !phone) {
    return res.status(400).json({ message: 'Please provide all required booking fields.' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const packageItem = await Package.findById(packageId);
  if (!packageItem) {
    return res.status(404).json({ message: 'Package not found.' });
  }



  const booking = await Booking.create({
    userId,
    userName: user.username,
    packageId,
    packageName: packageName || packageItem.packageName,
    travelDate,
    travelersCount,
    fullName,
    phone,
    paymentStatus: 'Unpaid',
    status: 'Pending',
  });

  res.status(201).json(booking);
});

const getBookingsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.status(200).json(bookings);
});


const getBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid booking ID.' });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  res.status(200).json(booking);
});


const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid booking ID.' });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  booking.status = 'Cancelled';
  booking.paymentStatus = 'Cancelled';
  await booking.save();

  res.status(200).json({ message: 'Booking cancelled successfully.', booking });
});



module.exports = {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  getBooking,
  cancelBooking
};
  
