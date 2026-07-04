const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
   
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'GCash', 'Bank Transfer'],
        required: true,
    },
   
    transactionDate: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('Transaction', transactionSchema);
