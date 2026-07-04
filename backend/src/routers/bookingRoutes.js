const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingsByUser,
  getBookingById,
  cancelBooking,
  rescheduleBooking,
  updatePayment,
} = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/user/:userId', getBookingsByUser);
router.get('/:id', getBookingById);


module.exports = router;
