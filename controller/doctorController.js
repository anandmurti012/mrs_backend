const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Import your MySQL connection

// Update doctor details
exports.doctorsRoutes('/edit/:id', async (req, res) => {
  const doctorId = req.params.id;
  const { name, specialization, phone, address, consultation, availability } = req.body;

  try {
    // Update doctor basic info in the 'doctors' table
    const updateDoctorQuery = `
      UPDATE doctors 
      SET name = ?, specialization = ?, phone = ?, address = ?, consultation = ?
      WHERE id = ?
    `;
    await db.query(updateDoctorQuery, [name, specialization, phone, address, consultation, doctorId], (err) => {
      if (err) {
        console.error('Error updating doctor:', err);
        return res.status(500).json({ error: 'Failed to update doctor' });
      }

      // Delete existing availability slots for the doctor
      const deleteAvailabilityQuery = `
        DELETE FROM doctor_availability WHERE doctorId = ?
      `;
      db.query(deleteAvailabilityQuery, [doctorId], (err) => {
        if (err) {
          console.error('Error deleting availability slots:', err);
          return res.status(500).json({ error: 'Failed to delete existing availability' });
        }

        // Insert new availability slots
        const insertAvailabilityQuery = `
          INSERT INTO doctor_availability (doctorId, day, startTime, endTime)
          VALUES (?, ?, ?, ?)
        `;
        const insertAvailabilityPromises = availability.flatMap(slot =>
          slot.timeSlots.map(timeSlot =>
            db.query(insertAvailabilityQuery, [doctorId, slot.day, timeSlot.startTime, timeSlot.endTime])
          )
        );

        Promise.all(insertAvailabilityPromises)
          .then(() => {
            res.status(200).json({ message: 'Doctor updated successfully' });
          })
          .catch(insertError => {
            console.error('Error inserting new availability:', insertError);
            res.status(500).json({ error: 'Failed to insert new availability' });
          });
      });
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

module.exports = router;
