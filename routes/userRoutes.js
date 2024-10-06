// const express = require('express');
// const { getAllUsers, createUser } = require('../controller/userController');
// const router = express.Router();

// router.get('/users', getAllUsers);
// router.post('/users', createUser);

// module.exports = router;


//===================================================
const express = require('express');
const { getAllUsers, createUser, getDoctorAvailability } = require('../controller/userController');
const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/doctorAvailability/:doctor', getDoctorAvailability); // New route to get availability

module.exports = router;

