const Booking = require('../models/bookingModel');
const db = require('../database/db');
const connection = require('../database/db');
const { transactions } = require('./transacctionController');

exports.getAllBookings = async (req, res) => {
  const { searchTerm, searchDoctorTerm, selectedDate, status, selectedDoctor, page } = req.query;

  // Base query, including `status=''` condition
  let query = "SELECT * FROM bookings WHERE status=''";
  let countQuery = "SELECT COUNT(*) AS total FROM bookings WHERE status=''";
  const queryParams = [];
  const countParams = [];

  // Apply additional filters to both queries
  if (searchTerm) {
    query += " AND (name LIKE ? OR bookingId LIKE ? OR phone LIKE ?)";
    countQuery += " AND (name LIKE ? OR bookingId LIKE ? OR phone LIKE ?)";
    const searchTermPattern = `%${searchTerm}%`;
    queryParams.push(searchTermPattern, searchTermPattern, searchTermPattern);
    countParams.push(searchTermPattern, searchTermPattern, searchTermPattern);

  }

  if (searchDoctorTerm) {
    query += " AND doctor LIKE ?";
    countQuery += " AND doctor LIKE ?";
    const doctorSearchPattern = `%${searchDoctorTerm}%`;
    queryParams.push(doctorSearchPattern);
    countParams.push(doctorSearchPattern);
  }

  if (status) {
    query += " AND status = ?";
    countQuery += " AND status = ?";
    queryParams.push(status);
    countParams.push(status);
  }

  if (selectedDate) {
    try {
      const parsedDate = new Date(selectedDate).toISOString().split("T")[0]; // Format as YYYY-MM-DD
      query += " AND DATE(timeStamp) = ?";
      countQuery += " AND DATE(timeStamp) = ?";
      queryParams.push(parsedDate);
      countParams.push(parsedDate);
    } catch (error) {
      console.error("Invalid selectedDate format:", selectedDate);
    }
  }

  if (selectedDoctor) {
    query += " AND doctor = ?";
    countQuery += " AND doctor = ?";
    queryParams.push(selectedDoctor);
    countParams.push(selectedDoctor);
  }

  // Add sorting by bookingId in descending order
  query += " ORDER BY bookingId DESC";

  // Pagination
  const limit = 10;
  const currentPage = parseInt(page, 10) || 1; // Default to page 1
  const offset = (currentPage - 1) * limit;
  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  try {
    // Fetch filtered results
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ msg: "Error fetching bookings" });
      }

      // Fetch total count for pagination
      connection.query(countQuery, countParams, (error, countResults) => {
        if (error) {
          console.error("Error counting entries:", error);
          return res.status(500).json({ msg: "Error fetching count" });
        }

        const totalEntries = countResults[0].total;
        const totalPages = Math.ceil(totalEntries / limit);

        return res.status(200).json({
          results: results,
          totalPages: totalPages,
          currentPage: currentPage,
          totalEntries: totalEntries,
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};


exports.getConfirmedBookings = async (req, res) => {
  const { searchTerm, selectedDoctor, selectedDate, status } = req.query; // Corrected variable name to 'status'

  // Start building the query
  let query = "SELECT * FROM bookings WHERE 1=1 AND status IN ('Confirmed', 'Cancelled')";

  const queryParams = []; // Array to hold query parameters

  // Construct the SQL query based on query parameters
  if (searchTerm) {
    query += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
    const searchTermPattern = `%${searchTerm}%`;
    queryParams.push(searchTermPattern, searchTermPattern, searchTermPattern);
  }

  if (status) {
    query += " AND status = ?";
    queryParams.push(status);
  }

  // Filter by selectedDate
  if (selectedDate) {
    try {
      const parsedDate = new Date(selectedDate).toISOString().split("T")[0]; // Extract YYYY-MM-DD
      query += " AND DATE(timeStamp) = ?";
      queryParams.push(parsedDate);
    } catch (error) {
      console.error("Invalid selectedDate format:", selectedDate);
    }
  }

  if (selectedDoctor) {
    query += " AND doctor = ?";
    queryParams.push(selectedDoctor);
  }

  try {
    // Use a prepared statement to prevent SQL injection
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error executing query:", error); // Log the error
        return res.status(500).json({ msg: error.sqlMessage }); // Send error response
      }

      // Return the results as a JSON response
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error fetching bookings:", error); // Log the error
    return res.status(500).json({ error: "Failed to fetch bookings" }); // Send error response
  }
};
exports.getBookingData = async (req, res) => {
  try {
    // Query to fetch all bookings
    const query = "SELECT * FROM bookings";
    console.log("query booking::::", query);

    // Execute the query
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching booking data:", error); // Log the error
        return res.status(500).json({ message: "Error fetching booking data" }); // Send error response
      }

      // Return the fetched data as a JSON response
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error("Unexpected error in getBookingData:", error); // Log unexpected errors
    return res.status(500).json({ message: "Unexpected error occurred" }); // Send error response
  }
};


// Create a new user
exports.createBooking = (req, res) => {
  const { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName, fees } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }

  const newBooking = { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName, fees };

  Booking.create(newBooking, (err, result) => {
    if (err) {
      console.error('Error creating Booking:', err);
      res.status(500).json({ message: 'Error creating user' });
    } else {
      res.status(201).json({
        message: 'User added successfully',
        bookingId: result.insertId,
        name: name,
        address: address,
        phone: phone,
        doctor: doctor,
        timeSlot: timeSlot,
        day: day,
      });
    }
  });
};

// Create a booking by admin
exports.createBookingByAdmin = (req, res) => {
  const { name, address, phone, email, gender, age, doctor, fees, day, timeSlot } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }
  const addedBy = 'admin';
  const adminId = req.rootUser.adminId;
  const adminName = req.rootUser.adminName;
  const status = 'Confirmed';

  const newBooking = { name, address, phone, email, gender, age, doctor, fees, day, timeSlot, status, addedBy, adminId, adminName };

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
  // console.log("book:::", bookingId);

  const query = 'UPDATE bookings SET status = ? WHERE bookingId = ?';
  db.query(query, ['Confirmed', bookingId], async(err, result) => {
    if (err) {
      console.error('Error confirming booking:', err);
      return res.status(500).json({ message: 'Error confirming booking' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await transactions(bookingId, 'credit')

    return res.status(200).json({ message: 'Booking confirmed successfully' });
  });
};

// Cancel a booking
exports.cancelBooking = (req, res) => {
  const bookingId = req.params.bookingId;
  console.log("book:::", bookingId);

  const query = 'UPDATE bookings SET status = ? WHERE bookingId = ?';
  db.query(query, ['Cancelled', bookingId],async (err, result) => {
    if (err) {
      console.error('Error canceling booking:', err);
      return res.status(500).json({ message: 'Error canceling booking' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await transactions(bookingId, 'debit')

    return res.status(200).json({ message: 'Booking canceled successfully' });
  });
};

