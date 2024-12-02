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
  getDoctorAvailability: (doctorId, callback) => {
    const sql = 'SELECT name, availability FROM doctors WHERE id = ?';
    db.query(sql, [doctorId], (err, result) => {
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
