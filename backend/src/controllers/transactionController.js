const asyncHandler = require('express-async-handler');
const Booking = require('../models/booking');
const User = require('../models/user');
const Package = require('../models/packages');
const Transaction = require('../models/transaction');

const createTransaction = asyncHandler(async (req, res) => {
    const { userId, bookingId, paymentMethod, amount } = req.body;

    if (!userId || !bookingId || !paymentMethod || !amount) {
        return res.status(400).json({ message: 'Please provide all required transaction fields.' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }   

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' });
    }

    const transaction = await Transaction.create({
        userId,
        bookingId,
        amount,
        paymentMethod,

        
    });

    // Update the booking's payment status to 'Completed'
   booking.paymentStatus = 'Paid';
    await booking.save();

    res.status(201).json(transaction);
});


module.exports = {
    createTransaction,
};