const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  getBooking,
  cancelBooking
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.post('/create', createBooking);
router.get('/', getAllBookings);
router.get('/user/:userId', getBookingsByUser);
router.get('/:id', getBooking);
router.get('/getBooking/:id', getBooking);
router.put('/cancel/:id', cancelBooking);



module.exports = router;
