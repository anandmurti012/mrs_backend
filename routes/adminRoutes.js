const express = require('express');
const { addDoctor, getAllDoctors, doctorName, doctorRouter,createAdmin, loginAdmin, getAllAdmin } = require('../controller/adminController'); // Importing addDoctor properly
const router = express.Router();
const { body } = require('express-validator');
const { VerifyToken } = require('../middleware/verifyToken');

router.get('/doctors', getAllDoctors); // Ensure route matches the controller function
// router.get('/doctorroute', doctorRouter); // Ensure route matches the controller function
router.post('/doctors', addDoctor); // Ensure route matches the controller function
router.get('/alldoctors', doctorName);
router.post('/admins', VerifyToken,createAdmin);
router.get('/admins', getAllAdmin);
router.post('/adminlogin', loginAdmin);

module.exports = router;
