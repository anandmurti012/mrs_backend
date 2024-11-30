const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../database/db');
const dotenv = require('dotenv')
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

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

// exports.doctorRouter = (req, res) => {
//   const query = `SELECT * FROM doctors WHERE status = 'Active'`;

//   try {
//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error("Error fetching doctors:", error);
//         return res.status(500).json({ msg: error.sqlMessage });
//       }
//       res.status(200).json(results);
//     });
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ error: "Failed to fetch doctors" });
//   }
// };

exports.addDoctor = (req, res) => {
  const { name, docId, phone, address, consultation, fees,experience, specialization, availability } = req.body;
  console.log(req.body)
  if (!name || !docId) {
    return res.status(400).json({ message: 'DocName and DocId are required' });
  }

  // Convert availability array to JSON string
  const availabilityString = JSON.stringify(availability);  // Or you can use availability.join(',')

  const newDoctor = { name, docId, phone, address, fees, consultation, experience, specialization, availability };

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
  const sql = `SELECT name, specialization,fees FROM doctors WHERE status = 'Active'`;
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
  const { adminName, emailId, address, phoneNo, passCode, password } = req.body.values;

  if (req.rootUser.passCode !== req.body.adminPasscode) {
    return res.status(401).json({ msg: 'Invalid Passcode' });
  }


  connection.query(`SELECT emailId FROM admins WHERE emailId='${emailId}'`, async function (error, result) {
    if (error) {
      return res.status(404).json({ msg: error.sqlMessage });
    } else {
      if (result.length === 0) {
        // Check for required fields
        if (!adminName || !emailId || !passCode || !password) {
          return res.status(400).json({ message: 'Admin Name, Email Id, passCode, and Password are required' });
        }

        // Create new admin object
        const newAdmin = {
          type:'subAdmin',
          adminName,
          emailId,
          address,
          phoneNo,
          passCode,
          password: password,  // Store the hashed password
        };

        // Save the new admin to the database
        Admin.create(newAdmin, (err, result) => {
          if (err) {
            console.error('Error creating Admin:', err);
            return res.status(500).json({ message: 'Error creating Admin' });
          }

          res.status(201).json({
            message: 'Admin added successfully'
          });
        });

      } else {
        return res.status(409).json({ msg: 'Enter email id already exist,try another email' });
      }
    }
  });
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
    const { email, password } = req.body;

    if (!email) {
      return res.status(401).json({ msg: 'Please enter valid user id' })
    } else if (!password) {
      return res.status(401).json({ msg: 'Please enter valid password' })
    } else {
      connection.query(`SELECT * FROM admins WHERE emailId='${email}'`, async (error, results) => {
        if (error) {
          return res.status(500).json({ msg: error.sqlMessage || 'Database query error' });
        } else {
          if (results.length === 0) {
            // No user found with that email
            return res.status(404).json({ msg: 'User not found' });
          }

          const user = results[0];

          if (await bcrypt.compare(password, user.password)) {
            const email = user.emailId

            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
            return res.status(200).json({ user: user, token: token, msg: 'Login successful' });
          } else {
            return res.status(401).json({ msg: "Invalid Password" });
          }
        }
      });
    }
  } catch (error) {
    console.log('Backend Server Error', error);
    return res.status(500).json({ msg: "Backend Server Error" });
  }
}
