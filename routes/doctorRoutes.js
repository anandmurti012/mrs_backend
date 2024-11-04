const express = require('express');
const doctorRouter = express.Router();
const db = require('../database/db'); // Import your MySQL connection
const connection = require('../database/db');


// Update doctor details
doctorRouter.patch('/update-doctors', async (req, res) => {
  const { name, id, phone, address, consultation } = req.body;

  // Check if the required fields are provided
  if (!id) {
    return res.status(400).json({ error: "Doctor ID is required." });
  }

  // Construct the update query
  const query = `UPDATE doctors SET 
                   name = ?, 
                   phone = ?, 
                   address = ?, 
                   consultation = ? 
                 WHERE id = ?`;

  // Prepare the parameters for the query
  const queryParams = [name, phone, address, consultation, id];

  try {
    // Execute the update query
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error executing query:", error); // Log the error
        return res.status(500).json({ msg: error.sqlMessage }); // Send error response
      }

      // Check if any row was affected
      if (results.affectedRows === 0) {
        return res.status(404).json({ msg: "Doctor not found." }); // Handle case where no rows were updated
      }

      // Return success response
      return res.status(200).json({ msg: "Doctor updated successfully." });
    });

  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

module.exports = doctorRouter;
