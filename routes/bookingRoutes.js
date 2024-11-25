const express = require('express');
const {
  getAllBookings,
  getConfirmedBookings,
  createBooking,
  getDoctorAvailability,
  createBookingByAdmin,
  confirmBooking, 
  cancelBooking,
  getBookingData    
} = require('../controller/bookingController');

const { VerifyToken } = require('../middleware/VerifyToken');
const router = express.Router();

// Existing routes
router.get('/bookings',VerifyToken, getAllBookings);
router.get('/confirmBookings',VerifyToken, getConfirmedBookings);
router.get('/bookingdata', getBookingData);
router.post('/bookings', createBooking);
router.post('/adminCreates', createBookingByAdmin);
router.get('/doctorAvailability/:doctor', getDoctorAvailability); 

// Routes for confirming and canceling bookings
router.put('/bookings/:bookingId/confirm', confirmBooking);  // Confirm booking
router.put('/bookings/:bookingId/toBeDeleted', cancelBooking);        // Cancel booking

module.exports = router;


