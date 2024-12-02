const express = require('express');
const { addDoctor, getAllDoctors, createAdmin, loginAdmin, getAllAdmin, getDoctors } = require('../controller/adminController'); // Importing addDoctor properly
const router = express.Router();
const { VerifyToken } = require('../middleware/VerifyToken');

router.get('/doctors', getAllDoctors); // Ensure route matches the controller function
router.post('/doctors', addDoctor); // Ensure route matches the controller function

router.get('/alldoctors', getDoctors); // Anyone can access

router.post('/admins', VerifyToken, createAdmin); // Protected
router.get('/admins', getAllAdmin);
router.post('/adminlogin', loginAdmin);

module.exports = router;
