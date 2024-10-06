// const User = require('../models/userModel');
// console.log("Useerrrr", User);

// // Get all users
// exports.getAllUsers = (req, res) => {
//   User.getAll((err, results) => {
//     if (err) {
//       console.error('Error retrieving users:', err); // Log the actual error
//       res.status(500).json({ message: 'Error retrieving users' });
//     } else {
//       res.status(200).json(results); // Return users data with a 200 OK status
//     }
//   });
// };

// // Create a new user
// exports.createUser = (req, res) => {
//   const { name, address, phone, email, gender, age, doctor, availability } = req.body;
//   console.log("req body", req.body);

//   // Simple validation of the request body
//   if (!name || !email || !phone) {
//     return res.status(400).json({ message: 'Name, email, and phone are required' });
//   }

//   const newUser = { name, address, phone, email, gender, age, doctor,availability };
//   console.log("new user", newUser);

//   // Insert new user into the database
//   User.create(newUser, (err, result) => {
//     if (err) {
//       console.error('Error creating user:', err); // Log the error to check details
//       res.status(500).json({ message: 'Error creating user' });
//     } else {
//       res.status(201).json({
//         message: 'User added successfully',
//         userId: result.insertId // Return the ID of the inserted user
//       });
//     }
//   });
// };



//=================================================================================================
const User = require('../models/userModel');

// Get all users
exports.getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
      res.status(500).json({ message: 'Error retrieving users' });
    } else {
      res.status(200).json(results);
    }
  });
};

// Create a new user
exports.createUser = (req, res) => {
  const { name, address, phone, email, gender, age, doctor, availability } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }

  const newUser = { name, address, phone, email, gender, age, doctor, availability };

  User.create(newUser, (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Error creating user' });
    } else {
      res.status(201).json({
        message: 'User added successfully',
        userId: result.insertId
      });
    }
  });
};

// Fetch doctor availability
exports.getDoctorAvailability = (req, res) => {
  const doctorName = req.params.doctor;
  console.log("Fetching doctor availability for:", doctorName);
  
  User.getDoctorAvailability(doctorName, (err, doctor) => {
    if (err) {
      console.error('Error fetching doctor availability:', err);
      return res.status(500).json({ message: 'Error fetching availability' });
    }
    if (doctor) {
      console.log("Doctor name:", doctor.name, "Availability:", doctor.availability); // Log availability here
      return res.status(200).json(doctor);
    } else {
      return res.status(404).json({ message: 'Doctor not found' });
    }
  });
};



