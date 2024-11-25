const express = require('express');
const doctorRouter = express.Router();
const db = require('../database/db'); // Import MySQL connection
const connection = require('../database/db');

// Update doctor details
doctorRouter.patch('/update-doctors', async (req, res) => {
  const { name, id, phone, address, consultation } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Doctor ID is required." });
  }

  const query = `UPDATE doctors SET name = ?, phone = ?, address = ?, consultation = ? WHERE id = ?`;
  const queryParams = [name, phone, address, consultation, id];

  try {
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ msg: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ msg: "Doctor not found." });
      }
      return res.status(200).json({ msg: "Doctor updated successfully." });
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

// Toggle doctor status (Active/Blocked)
doctorRouter.patch('/update-doctor-status', async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Doctor ID and status are required." });
  }

  const query = `UPDATE doctors SET status = ? WHERE id = ?`;

  try {
    connection.query(query, [status, id], (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ msg: error.sqlMessage });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ msg: "Doctor not found." });
      }
      return res.status(200).json({ msg: `Doctor status updated to ${status}` });
    });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ error: 'Failed to update doctor status' });
  }
});


module.exports = doctorRouter;

