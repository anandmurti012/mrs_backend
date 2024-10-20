// const express = require('express');
// const { getAllUsers, createUser } = require('../controller/userController');
// const router = express.Router();

// router.get('/users', getAllUsers);
// router.post('/users', createUser);

// module.exports = router;


//===================================================
const express = require('express');
const { getAllUsers, createUser, getDoctorAvailability,createUserByAdmin } = require('../controller/userController');
const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.post('/adminCreates', createUserByAdmin);
router.get('/doctorAvailability/:doctor', getDoctorAvailability); // New route to get availability

module.exports = router;

