const express = require('express');
const { addDoctor,getAllDoctors,doctorName,createAdmin,loginAdmin } = require('../controller/adminController'); // Importing addDoctor properly
const router = express.Router();
const { body } = require('express-validator');

router.get('/doctors', getAllDoctors); // Ensure route matches the controller function
router.post('/doctors', addDoctor); // Ensure route matches the controller function
router.get('/alldoctors', doctorName);
router.post('/admins', createAdmin);
router.post('/adminlogin', loginAdmin);

module.exports = router;
