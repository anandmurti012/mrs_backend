// const connection = require('../database/db');

// const Bookings = {};

// Bookings.create = (bookingData, callback) => {
//   const sql = 'INSERT INTO bookings SET ?';
//   connection.query(sql, bookingData, callback);
// };
// Bookings.createByAdmin = (bookingData, callback) => {
//   const sql = 'INSERT INTO bookings SET ?';
//   connection.query(sql, bookingData, callback);
// };

// Bookings.getAll = (callback) => {
//   const sql = 'SELECT * FROM bookings';
//   connection.query(sql, callback);
// };

// Bookings.getDoctorAvailability = (doctorName, callback) => {
//   const sql = 'SELECT name, availability FROM doctors WHERE name = ?';
//   connection.query(sql, [doctorName], (err, result) => {
//     if (err) return callback(err);
//     if (result.length > 0) {
//       const doctor = {
//         name: result[0].name,
//         availability: JSON.parse(result[0].availability) // Assuming availability is stored as JSON
//       };
//       return callback(null, doctor);
//     }
//     return callback(null, null);
//   });
// };


// module.exports = Bookings;

//==================================//=======================================
const db = require('../database/db');

const Booking = {
  getAll: (callback) => {
    db.query('SELECT * FROM bookings', callback);
  },
  create: (newBooking, callback) => {
    db.query('INSERT INTO bookings SET ?', newBooking, callback);
  },
  createByAdmin: (newBooking, callback) => {
    db.query('INSERT INTO bookings SET ?', newBooking, callback);
  },
  getDoctorAvailability: (doctorName, callback) => {
    const sql = 'SELECT name, availability FROM doctors WHERE name = ?';
    db.query(sql, [doctorName], (err, result) => {
      if (err) return callback(err);
      if (result.length > 0) {
        const doctor = {
          name: result[0].name,
          availability: JSON.parse(result[0].availability) // Assuming availability is stored as JSON
        };
        return callback(null, doctor);
      }
      return callback(null, null); // No doctor found
    });
  }
};

module.exports = Booking;
