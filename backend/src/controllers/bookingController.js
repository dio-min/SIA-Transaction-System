const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const User = require("../models/user");
const Package = require("../models/packages");
const axios = require("axios");



const createBooking = asyncHandler(async (req, res) => {
  const {
    userId,
    packageId,
    packageName,
    travelDate,
    travelersCount,
    fullName,
    phone,
    isHotelRoomReserved, // Now expected as a boolean from the frontend
  } = req.body;

  if (
    !userId ||
    !packageId ||
    !packageName ||
    !travelDate ||
    !travelersCount ||
    !fullName ||
    !phone
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required booking fields." });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const packageItem = await Package.findById(packageId);
  if (!packageItem) {
    return res.status(404).json({ message: "Package not found." });
  }

  // 1. Create the base booking
  const booking = await Booking.create({
    userId,
    userName: user.username,
    packageId,
    packageName: packageName || packageItem.packageName,
    travelDate,
    travelersCount,
    fullName,
    phone,
    paymentStatus: "Unpaid",
    status: "Pending",
    room: "Pending",
  });

  // 2. Handle External Hotel Reservation if requested
  // FIX: Checked as truthy boolean instead of the string "yes"
  if (isHotelRoomReserved === true || isHotelRoomReserved === "yes") {
    try {
      const checkoutDateObj = new Date(travelDate);
      checkoutDateObj.setDate(checkoutDateObj.getDate() + packageItem.duration_days);
      const checkOutDate = checkoutDateObj.toISOString().split('T')[0];

      const checkInTime = packageItem.checkInTime || "14:00";
      const hours = packageItem.duration_days * 24;
      const calculatedPrice = 1365 * (hours / 24);

      const response = await axios.post(
        `${process.env.EXTERNAL_RESERVATION_BASE_URL}/api/external/reservations`,
        {
          userId: user._id,
          checkInDate: travelDate,
          checkOutDate: checkOutDate,
          checkInTime: checkInTime,
          selectedRoom: packageItem.roomType || "premium",
          hours: hours,
          notes: "-Bisita NV Reservation-",
          totalAmount: calculatedPrice,
          paymentDetails: {
            status: "pending",
          },
        },
        {
          headers: {
            "x-api-key": process.env.INTERNAL_API_KEY,
          },
          timeout: 10000,
        }
      );

      const externalId = response.data?.data?._id;
      if (!response.data?.success || !externalId) {
        throw new Error(
          response.data?.message || "External reservation was not created (invalid response)."
        );
      }

      // Update booking with external details if successful
      booking.externalReservationId = externalId;
      booking.reservationFee = calculatedPrice;
      await booking.save();

    } catch (error) {
      console.error(
        "Failed to send reservation request:",
        error.response?.data || error.message
      );

      // FIX: Clean up the created booking ONLY if the external reservation fails
      await Booking.findByIdAndDelete(booking._id);
      
      return res.status(400).json({
        message:
          error.response?.data?.message ||
          error.message ||
          "Sorry, no rooms are available for your selected dates.",
      });
    }
  }

  // 3. Fire-and-forget admin notification
  try {
    axios.post(`${process.env.ADMIN_URL}/api/notify`, {
      system: "tourism",
    });
  } catch (err) {
    console.error("Failed to send notification:", err.message);
  }

  // 4. Return successful booking status
  res.status(201).json(booking);
});
const getBookingsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
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
    return res.status(400).json({ message: "Invalid booking ID." });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }
  res.status(200).json(booking);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid booking ID." });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  

  try {
  if (booking.externalReservationId) {
    await axios.put(
      `${process.env.EXTERNAL_RESERVATION_BASE_URL}/api/external/reservations/${booking.externalReservationId}/cancel`,
      {}, // ✅ empty body — this endpoint takes reservationId from the URL, not the body
      {
        headers: {
          "x-api-key": process.env.INTERNAL_API_KEY,
        },
      }
    );
  }
  else {
    room = "not reserved";
  }
} catch (error) {
  console.error("Failed to update external reservation:", error.response?.data || error.message);
}

  booking.status = "Cancelled";
  booking.paymentStatus = "Cancelled";
  await booking.save();



  try {
    axios.post(`${process.env.ADMIN_URL}/api/notify`, {
      system: "tourism",
    });
  } catch (err) {
    console.error("Failed to send notification:", err.message);
  }

  res.status(200).json({ message: "Booking cancelled successfully.", booking });
});

module.exports = {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  getBooking,
  cancelBooking,
};
