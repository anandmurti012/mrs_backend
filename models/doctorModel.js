// const connection = require('../database/db');

// const Doctor = {};

// Doctor.create = (doctorData, callback) => {
//   const sql = 'INSERT INTO doctors SET ?';
//   connection.query(sql, doctorData, callback);
// };

// Doctor.getAll = (callback) => {
//   const sql = 'SELECT * FROM doctors';
//   connection.query(sql, callback);
// };

// module.exports = Doctor;

const connection = require('../database/db');

const Doctor = {};
console.log("doctors::::", Doctor);
// Create a new doctor
Doctor.create = (doctorData, callback) => {
  const sql = 'INSERT INTO doctors SET ?';
  connection.query(sql, doctorData, callback);
};
 
// Get all doctors
Doctor.getAll = (sql, callback) => {
  connection.query(sql, callback);
};

// Get availability by doctor ID
Doctor.getById = (sql, id, callback) => {
  connection.query(sql, [id], callback);
};

module.exports = Doctor;

