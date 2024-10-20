// const connection = require('../database/db');

// const User = {};

// User.create = (userData, callback) => {
//   const sql = 'INSERT INTO users SET ?';
//   connection.query(sql, userData, callback);
// };

// User.getAll = (callback) => {
//   const sql = 'SELECT * FROM users';
//   connection.query(sql, callback);
// };

// module.exports = User;


//===================================================================
const connection = require('../database/db');

const User = {};

User.create = (userData, callback) => {
  const sql = 'INSERT INTO bookings SET ?';
  connection.query(sql, userData, callback);
};
User.createByAdmin = (userData, callback) => {
  const sql = 'INSERT INTO bookings SET ?';
  connection.query(sql, userData, callback);
};

User.getAll = (callback) => {
  const sql = 'SELECT * FROM bookings';
  connection.query(sql, callback);
};

User.getDoctorAvailability = (doctorName, callback) => {
  const sql = 'SELECT name, availability FROM doctors WHERE name = ?';
  connection.query(sql, [doctorName], (err, result) => {
    if (err) return callback(err);
    if (result.length > 0) {
      const doctor = {
        name: result[0].name,
        availability: JSON.parse(result[0].availability) // Assuming availability is stored as JSON
      };
      return callback(null, doctor);
    }
    return callback(null, null);
  });
};


module.exports = User;
