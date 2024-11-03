// const Booking = require('../models/bookingModel');

// // Get all users
// exports.getAllBookings = (req, res) => {
//   Booking.getAll((err, results) => {
//     if (err) {
//       console.error('Error retrieving Booking:', err);
//       res.status(500).json({ message: 'Error retrieving users' });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// };

// // Create a new user
// exports.createBooking = (req, res) => {
//   const { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName } = req.body;

//   if (!name || !email || !phone) {
//     return res.status(400).json({ message: 'Name, email, and phone are required' });
//   }

//   const newBooking = { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName };
// console.log("newBooking::::;", newBooking);

// Booking.create(newBooking, (err, result) => {
//     if (err) {
//       console.error('Error creating Booking:', err);
//       res.status(500).json({ message: 'Error creating user' });
//     } else {
//       res.status(201).json({
//         message: 'User added successfully',
//         bookingId: result.insertId
//       });
//     }
//   });
// };
// exports.createBookingByAdmin = (req, res) => {
//   const { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName } = req.body;

//   if (!name || !email || !phone) {
//     return res.status(400).json({ message: 'Name, email, and phone are required' });
//   }

//   const newBooking = { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName };
// console.log("newBooking::::;", newBooking);

// Booking.createByAdmin(newBooking, (err, result) => {
//     if (err) {
//       console.error('Error creating Booking:', err);
//       res.status(500).json({ message: 'Error creating Booking' });
//     } else {
//       res.status(201).json({
//         message: 'Booking done successfully',
//         bookingId: result.insertId
//       });
//     }
//   });
// };

// // Fetch doctor availability
// exports.getDoctorAvailability = (req, res) => {
//   const doctorName = req.params.doctor;
//   console.log("Fetching doctor availability for:", doctorName);

//   Booking.getDoctorAvailability(doctorName, (err, doctor) => {
//     if (err) {
//       console.error('Error fetching doctor availability:', err);
//       return res.status(500).json({ message: 'Error fetching availability' });
//     }
//     if (doctor) {
//       console.log(
//         "Doctor name:", doctor.name,
//         "Availability:", JSON.stringify(doctor.availability, null, 2)
//       );

//       return res.status(200).json(doctor);
//     } else {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
//   });
// };

 
//==============================//==============================
const Booking = require('../models/bookingModel');
const db = require('../database/db');

// Get all users
exports.getAllBookings = (req, res) => {
  Booking.getAll((err, results) => {
    if (err) {
      console.error('Error retrieving Booking:', err);
      res.status(500).json({ message: 'Error retrieving users' });
    } else {
      res.status(200).json(results);
    }
  });
};

// Create a new user
exports.createBooking = (req, res) => {
  const { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }

  const newBooking = { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName };
  console.log("newBooking::::;", newBooking);

  Booking.create(newBooking, (err, result) => {
    if (err) {
      console.error('Error creating Booking:', err);
      res.status(500).json({ message: 'Error creating user' });
    } else {
      res.status(201).json({
        message: 'User added successfully',
        bookingId: result.insertId
      });
    }
  });
};

// Create a booking by admin
exports.createBookingByAdmin = (req, res) => {
  const { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }

  const newBooking = { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName };
  console.log("newBooking::::;", newBooking);

  Booking.createByAdmin(newBooking, (err, result) => {
    if (err) {
      console.error('Error creating Booking:', err);
      res.status(500).json({ message: 'Error creating Booking' });
    } else {
      res.status(201).json({
        message: 'Booking done successfully',
        bookingId: result.insertId
      });
    }
  });
};

// Fetch doctor availability
exports.getDoctorAvailability = (req, res) => {
  const doctorName = req.params.doctor;
  console.log("Fetching doctor availability for:", doctorName);

  Booking.getDoctorAvailability(doctorName, (err, doctor) => {
    if (err) {
      console.error('Error fetching doctor availability:', err);
      return res.status(500).json({ message: 'Error fetching availability' });
    }
    if (doctor) {
      console.log(
        "Doctor name:", doctor.name,
        "Availability:", JSON.stringify(doctor.availability, null, 2)
      );

      return res.status(200).json(doctor);
    } else {
      return res.status(404).json({ message: 'Doctor not found' });
    }
  });
};

// Confirm a booking
exports.confirmBooking = (req, res) => {
  const bookingId = req.params.bookingId;
  console.log("book:::", bookingId);

  const query = 'UPDATE bookings SET status = ? WHERE bookingId = ?';
  db.query(query, ['Confirmed', bookingId], (err, result) => {
    if (err) {
      console.error('Error confirming booking:', err);
      return res.status(500).json({ message: 'Error confirming booking' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ message: 'Booking confirmed successfully' });
  });
};

// Cancel a booking
exports.cancelBooking = (req, res) => {
  const bookingId = req.params.bookingId;
  console.log("book:::", bookingId);

  const query = 'UPDATE bookings SET status = ? WHERE bookingId = ?';
  db.query(query, ['Cancelled',bookingId], (err, result) => {
    if (err) {
      console.error('Error canceling booking:', err);
      return res.status(500).json({ message: 'Error canceling booking' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ message: 'Booking canceled successfully' });
  });
};

