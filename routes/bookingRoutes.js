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

// booking by user
router.post('/bookings', createBooking);
// booking by admin
router.post('/book-an-appointment',VerifyToken, createBookingByAdmin);

router.get('/doctorAvailability/:doctorId', getDoctorAvailability); 

// Routes for confirming and canceling  
router.put('/bookings/:bookingId/confirm', confirmBooking);  // Confirm booking
router.put('/bookings/:bookingId/toBeDeleted', cancelBooking);        // Cancel booking

module.exports = router;


