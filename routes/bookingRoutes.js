// const express = require('express');
// const { getAllBookings, createBooking, getDoctorAvailability,createBookingByAdmin } = require('../controller/bookingController');
// const router = express.Router();

// router.get('/bookings', getAllBookings);
// router.post('/bookings', createBooking);
// router.post('/adminCreates', createBookingByAdmin);
// router.get('/doctorAvailability/:doctor', getDoctorAvailability); // New route to get availability

// module.exports = router;

//==============================//===========================
const express = require('express');
const {
  getAllBookings,
  createBooking,
  getDoctorAvailability,
  createBookingByAdmin,
  confirmBooking,  // Controller for confirming booking
  cancelBooking    // Controller for canceling booking
} = require('../controller/bookingController');
const router = express.Router();

// Existing routes
router.get('/bookings', getAllBookings);
router.post('/bookings', createBooking);
router.post('/adminCreates', createBookingByAdmin);
router.get('/doctorAvailability/:doctor', getDoctorAvailability); 

// Routes for confirming and canceling bookings
router.put('/bookings/:bookingId/confirm', confirmBooking);  // Confirm booking
router.put('/bookings/:bookingId/toBeDeleted', cancelBooking);        // Cancel booking

module.exports = router;


