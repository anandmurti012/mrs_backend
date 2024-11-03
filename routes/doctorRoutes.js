const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Import your MySQL connection

// Update doctor details
router.put('/edit/:id', async (req, res) => {
  const doctorId = req.params.id;
  const { name, specialization, phone, address, consultation, availability } = req.body;

  try {
    // Update doctor basic info in the 'doctors' table
    const updateDoctorQuery = `
      UPDATE doctors 
      SET name = ?, specialization = ?, phone = ?, address = ?, consultation = ?
      WHERE id = ?
    `;
    await db.query(updateDoctorQuery, [name, specialization, phone, address, consultation, doctorId]);

    // Delete existing availability slots for the doctor
    const deleteAvailabilityQuery = `
      DELETE FROM doctor_availability WHERE doctorId = ?
    `;
    await db.query(deleteAvailabilityQuery, [doctorId]);

    // Insert new availability slots
    const insertAvailabilityQuery = `
      INSERT INTO doctor_availability (doctorId, day, startTime, endTime)
      VALUES (?, ?, ?, ?)
    `;
    for (let slot of availability) {
      for (let timeSlot of slot.timeSlots) {
        await db.query(insertAvailabilityQuery, [doctorId, slot.day, timeSlot.startTime, timeSlot.endTime]);
      }
    }

    res.status(200).json({ message: 'Doctor updated successfully' });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

module.exports = router;
