// const connection = require('../database/db');

// const Admin = {};

// Admin.create = (adminData, callback) => {
//   const sql = 'INSERT INTO admins SET ?';
//   connection.query(sql, adminData, callback);
// };

// module.exports = Admin

const connection = require('../database/db');
const bcrypt = require('bcrypt');

const Admin = {};

// Create a new admin with hashed password
Admin.create = async (adminData, callback) => {
  try {
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(adminData.password, 10); // 10 rounds of salt
    adminData.password = hashedPassword;

    const sql = 'INSERT INTO admins SET ?';
    connection.query(sql, adminData, callback);
  } catch (err) {
    console.error('Error hashing password:', err);
    callback(err, null);
  }
};

// Find an admin by email
Admin.findByEmail = (emailId, callback) => {
  const sql = 'SELECT * FROM admins WHERE emailId = ?';
  connection.query(sql, [emailId], (err, result) => {
    if (err) return callback(err);
    if (result.length === 0) return callback(null, null);
    callback(null, result[0]);
  });
};

// Update an admin's information
// Admin.update = (adminId, adminData, callback) => {
//   const sql = 'UPDATE admins SET ? WHERE id = ?';
//   connection.query(sql, [adminData, adminId], callback);
// };

// Delete an admin by id
// Admin.delete = (adminId, callback) => {
//   const sql = 'DELETE FROM admins WHERE id = ?';
//   connection.query(sql, [adminId], callback);
// };

module.exports = Admin;
