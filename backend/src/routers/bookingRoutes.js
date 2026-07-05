const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  getBooking,
} = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/', getAllBookings);
router.get('/user/:userId', getBookingsByUser);
router.get('/getBooking/:id', getBooking);



module.exports = router;
