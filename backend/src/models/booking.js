const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    travelDate: {
      type: String,
      required: true,
    },
    travelersCount: {
      type: Number,
      required: true,
      min: 1,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Cancelled'],
      default: 'Unpaid',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
