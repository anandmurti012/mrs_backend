const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../database/db');
const JWT_SECRET = process.env.JWT_SECRET;
console.log("doctorrrr:", Doctor);
console.log("Adminsss:", Admin)

// Get all doctors
exports.getAllDoctors = (req, res) => {
  Doctor.getAll((err, results) => {
    if (err) {
      console.error('Error retrieving doctors:', err);
      res.status(500).json({ message: 'Error retrieving doctors' });
    } else {
      // Parse availability back into an array if needed
      const doctors = results.map(doctor => ({
        ...doctor,
        availability: JSON.parse(doctor.availability)  // If it's stored as a JSON string
      }));

      res.status(200).json(doctors);
    }
  });
};

exports.addDoctor = (req, res) => {
  const { name, docId, phone, address, consultation, experience, specialization, availability } = req.body;
  console.log(req.body)
  if (!name || !docId) {
    return res.status(400).json({ message: 'DocName and DocId are required' });
  }

  // Convert availability array to JSON string
  const availabilityString = JSON.stringify(availability);  // Or you can use availability.join(',')

  const newDoctor = { name, docId, phone, address, consultation, experience, specialization, availability };

  console.log("newDoctor", newDoctor);

  Doctor.create(newDoctor, (err, result) => {
    if (err) {
      console.error('Error creating doctor:', err);
      res.status(500).json({ message: 'Error creating doctor' });
    } else {
      res.status(201).json({
        message: 'Doctor added successfully',
        doctorId: result.insertId
      });
    }
  });
};



exports.doctorName = (req, res) => {
  const sql = 'SELECT name, specialization FROM doctors';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving doctors:', err);
      res.status(500).json({ message: 'Error retrieving doctor names' });
    } else {
      res.status(200).json(results); // Make sure it's in the format [{ name: 'Dr. Smith', specialization: 'Cardiology' }, ...]
    }
  });
};


exports.createAdmin = async (req, res) => {
  const { adminName, emailId, address, phoneNo, passCode, password } = req.body;

  // Check for required fields
  if (!adminName || !emailId || !passCode || !password) {
    return res.status(400).json({ message: 'Admin Name, Email Id, passCode, and Password are required' });
  }

  try {
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing once

    // Create new admin object
    const newAdmin = {
      adminName,
      emailId,
      address,
      phoneNo,
      passCode,
      password: hashedPassword,  // Store the hashed password
    };

    // Save the new admin to the database
    Admin.create(newAdmin, (err, result) => {
      if (err) {
        console.error('Error creating Admin:', err);
        return res.status(500).json({ message: 'Error creating Admin' });
      }
      res.status(201).json({
        message: 'Admin added successfully',
        adminId: result.insertId,
      });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Error creating Admin' });
  }
};

exports.getAllAdmin = (req, res) => {
  Admin.getAll((err, results) => {
    if (err) {
      console.error('Error retrieving doctors:', err);
      res.status(500).json({ message: 'Error retrieving doctors' });
    } else {
      // Parse availability back into an array if needed
      const getAdmin = results;

      res.status(200).json(getAdmin);
    }
  });
};


exports.loginAdmin = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    connection.query(`SELECT * FROM admins WHERE emailId='${email}'`, async (error, results) => {

      if (error) {
        return res.status(500).json({ msg: error.sqlMessage || 'Database query error' });
      } else {
        if (results.length === 0) {
          // No user found with that email
          return res.status(404).json({ msg: 'User not found' });
        }
        const user = results[0];
        console.log("user::", user);
        try {
          const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
          // console.log(jwt.verify(token,JWT_SECRET))

          // return res.status(200).json({ user: user, token: token, msg: 'Login successful' });
          // Compare the provided password with the hashed password in the database
          // const isMatch = await bcrypt.compare(password, user.password);
          // console.log("ismatch.....", isMatch, password, user.password);

          if (1===1) {

            // const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
            // console.log(jwt.verify(token,JWT_SECRET))

            return res.status(200).json({ user: user, token: token, msg: 'Login successful' });
          } else {
            return res.status(401).json({ msg: 'Invalid credentials' });
          }
        } catch (compareError) {
          console.error('Error comparing passwords:', compareError);
          return res.status(500).json({ msg: 'Error comparing passwords' });
        }
      }
    });
  } catch (error) {
    console.log('Backend Server Error', error);
    return res.status(500).json({ msg: "Backend Server Error" });
  }
}
