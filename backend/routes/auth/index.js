const express = require('express');
const { registerUser, loginUser, logoutUser, getUser } = require('../../controllers/auth');
const protect = require('../../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/getUser', protect, getUser);

module.exports = router;