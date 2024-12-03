const Booking = require('../models/bookingModel');
const db = require('../database/db');
const connection = require('../database/db');
const { transactions } = require('./transacctionController');

exports.getAllBookings = async (req, res) => {
  const { searchTerm, selectedDate, selectedDoctor } = req.query;

  // Base query, including `status=''` condition
  let query = "SELECT * FROM bookings WHERE status='' ";
  let countQuery = "SELECT COUNT(*) AS total FROM bookings WHERE status='' ";
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
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = 10; // Default to 10 entries per page
  const offset = (page - 1) * limit;

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
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};


exports.getConfirmedBookings = async (req, res) => {
  const { searchTerm, selectedDoctor, selectedDate, status, page, pageSize } = req.query; // Corrected variable name to 'status'

  // Set default values for page and pageSize if not provided
  const currentPage = parseInt(page) || 1; // Default to page 1
  const currentPageSize = parseInt(pageSize) || 10; // Default to 10 results per page
  const offset = (currentPage - 1) * currentPageSize; // Calculate the offset

  // Start building the query for fetching results
  let query = "SELECT * FROM bookings WHERE 1=1 AND status IN ('Confirmed', 'Cancelled')";
  const queryParams = []; // Array to hold query parameters

  // Construct the SQL query based on query parameters
  if (searchTerm) {
    query += " AND (name LIKE ? OR bookingId LIKE ? OR phone LIKE ?)";
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

  query += " ORDER BY bookingId DESC"; // Fetch results in descending order by bookingId
  
  // Add pagination to the query
  query += " LIMIT ? OFFSET ?";
  queryParams.push(currentPageSize, offset); // Add limit and offset to queryParams

  // Count query to get the total number of matching entries
  let countQuery = "SELECT COUNT(*) AS total FROM bookings WHERE 1=1 AND status IN ('Confirmed', 'Cancelled')";
  const countParams = []; // Array to hold count query parameters

  // Apply the same filters to the count query
  if (searchTerm) {
    countQuery += " AND (name LIKE ? OR bookingId LIKE ? OR phone LIKE ?)";
    const searchTermPattern = `%${searchTerm}%`;
    countParams.push(searchTermPattern, searchTermPattern, searchTermPattern);
  }

  if (status) {
    countQuery += " AND status = ?";
    countParams.push(status);
  }

  if (selectedDate) {
    try {
      const parsedDate = new Date(selectedDate).toISOString().split("T")[0]; // Extract YYYY-MM-DD
      countQuery += " AND DATE(timeStamp) = ?";
      countParams.push(parsedDate);
    } catch (error) {
      console.error("Invalid selectedDate format:", selectedDate);
    }
  }

  if (selectedDoctor) {
    countQuery += " AND doctor = ?";
    countParams.push(selectedDoctor);
  }

  try {
    // Fetch filtered results
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ msg: error.sqlMessage }); // Send error response
      }

      // Fetch total count for pagination
      connection.query(countQuery, countParams, (error, countResults) => {
        if (error) {
          console.error("Error counting entries:", error);
          return res.status(500).json({ msg: "Error fetching count" });
        }

        const totalEntries = countResults[0].total;
        const totalPages = Math.ceil(totalEntries / currentPageSize); // Calculate total pages

        // Return paginated results with total pages and current page info
        return res.status(200).json({
          results: results,
          totalPages: totalPages,
          currentPage: currentPage,
          pageSize: currentPageSize,
          totalEntries: totalEntries,
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
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
  const { name, address, phone, email, gender, age, doctor, day, timeSlot, addedBy, adminId, adminName } = req.body;

  const doctorId = doctor

  const sql = 'SELECT name,specialization,fees FROM doctors WHERE id = ?';
  db.query(sql, [doctorId], (error, result) => {
    if (error) {
      console.error("Error fetching booking data:", error); // Log the error
      return res.status(500).json({ message: "Error fetching booking data" }); // Send error response
    }

    if (result.length > 0) {
      const doctorName = result[0]?.name
      const specialization = result[0]?.specialization
      const fees = result[0]?.fees

      if (!name || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
      }

      const doctor = doctorName;
      const docId = doctorId

      const newBooking = { name, address, phone, email, gender, age, day, doctor, docId, specialization, timeSlot, addedBy, adminId, adminName, fees };

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
            docId: docId,
            specialization: specialization,
            timeSlot: timeSlot,
            day: day,
          });
        }
      });
    } else {
      return res.status(404).json({ message: "Invalid Doctor" }); // Send error response
    }
  })
};

// Create a booking by admin
exports.createBookingByAdmin = (req, res) => {
  const { name, address, phone, email, gender, age, doctor, day, timeSlot } = req.body;

  const addedBy = 'admin';
  const adminId = req.rootUser.adminId;
  const adminName = req.rootUser.adminName;
  const status = 'Confirmed';

  const docId = doctor

  // Step 2: Fetch doctor data and check the consultation limit
  const sqlQ = 'SELECT consultation FROM doctors WHERE id = ?';
  db.query(sqlQ, [docId], (error, result) => {
    if (error) {
      console.error("Error doctor consultation limit:", error); // Log the error
      return res.status(500).json({ message: "Error doctor consultation limit" }); // Send error response
    }

    if (result.length > 0) {

      // Step 3: checking todays bookings
      const checkQuery = `SELECT COUNT(*) AS count FROM bookings WHERE status = 'Confirmed' AND DATE(updatedAt) = CURDATE() AND docId = ?`;

      db.query(checkQuery, [docId], async (err, results) => {
        if (err) {
          console.error('Error checking today\'s confirmed bookings:', err);
          return res.status(500).json({ message: 'Error fetching booking count' });
        }

        const fixedLimit = result[0]?.consultation
        const confirmedToday = results[0].count;

        if (confirmedToday > fixedLimit) {
          return res.status(400).json({ message: `Booking limit of ${fixedLimit} for today has been exceeded. No more bookings can be confirmed.` });
        } else {
          const sql = 'SELECT name,specialization,fees FROM doctors WHERE id = ?';
          db.query(sql, [docId], (error, result) => {
            if (error) {
              console.error("Error fetching booking data:", error); // Log the error
              return res.status(500).json({ message: "Error fetching booking data" }); // Send error response
            }

            if (result.length > 0) {
              const doctorName = result[0]?.name
              const specialization = result[0]?.specialization
              const fees = result[0]?.fees

              if (!name || !phone) {
                return res.status(400).json({ message: 'Name, email, and phone are required' });
              }

              const doctor = doctorName;

              const newBooking = { name, address, phone, email, gender, age, day, doctor, docId, specialization, timeSlot, status, addedBy, adminId, adminName, fees };

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
                    docId: docId,
                    specialization: specialization,
                    timeSlot: timeSlot,
                    day: day,
                  });
                }
              });
            } else {
              return res.status(404).json({ message: "Invalid Doctor" }); // Send error response
            }
          })
        }
      })
    } else {
      return res.status(404).json({ message: "Invalid Doctor" }); // Send error response
    }
  });
};

// Fetch doctor availability
exports.getDoctorAvailability = (req, res) => {
  const doctorId = req.params.doctorId;

  Booking.getDoctorAvailability(doctorId, (err, doctor) => {
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
  const { bookingId } = req.params

  // Step 1: Fetch doctor ID from the booking
  const sql = 'SELECT docId FROM bookings WHERE bookingId = ?';
  db.query(sql, [bookingId], (error, result) => {
    if (error) {
      console.error("Error Doctor Id:", error); // Log the error
      return res.status(500).json({ message: "Error Doctor Id" }); // Send error response
    }

    if (result.length > 0) {
      const docId = result[0]?.docId

      // Step 2: Fetch doctor data and check the consultation limit
      const sql = 'SELECT consultation FROM doctors WHERE id = ?';
      db.query(sql, [docId], (error, result) => {
        if (error) {
          console.error("Error doctor consultation limit:", error); // Log the error
          return res.status(500).json({ message: "Error doctor consultation limit" }); // Send error response
        }

        if (result.length > 0) {

          // Step 3: checking todays bookings
          const checkQuery = `SELECT COUNT(*) AS count FROM bookings WHERE status = 'Confirmed' AND DATE(updatedAt) = CURDATE() AND docId = ?`;

          db.query(checkQuery, [docId], async (err, results) => {
            if (err) {
              console.error('Error checking today\'s confirmed bookings:', err);
              return res.status(500).json({ message: 'Error fetching booking count' });
            }

            const fixedLimit = result[0]?.consultation
            const confirmedToday = results[0].count;

            if (confirmedToday > fixedLimit) {
              return res.status(400).json({ message: `Booking limit of ${fixedLimit} for today has been exceeded. No more bookings can be confirmed.` });
            } else {

              // Step 4: Updated bookings
              const query = 'UPDATE bookings SET status = ?, updatedAt = NOW() WHERE bookingId = ?';
              db.query(query, ['Confirmed', bookingId], async (err, result) => {
                if (err) {
                  console.error('Error confirming booking:', err);
                  return res.status(500).json({ message: 'Error confirming booking' });
                }
                if (result.affectedRows === 0) {
                  return res.status(404).json({ message: 'Booking not found' });
                }

                await transactions(bookingId, 'credit');

                return res.status(200).json({ message: 'Booking confirmed successfully' });
              });
            }
          })
        } else {
          return res.status(404).json({ message: "Invalid Doctor" }); // Send error response
        }
      });
    } else {
      return res.status(404).json({ message: "Invalid Doctor" }); // Send error response
    }
  })
};

// Cancel a booking
exports.cancelBooking = (req, res) => {
  const bookingId = req.params.bookingId;
  console.log("book:::", bookingId);

  const query = 'UPDATE bookings SET status = ? WHERE bookingId = ?';
  db.query(query, ['Cancelled', bookingId], async (err, result) => {
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

