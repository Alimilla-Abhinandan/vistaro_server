const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateSignin } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Signup Route
router.post('/signup', validateSignup, authController.signup);

// Signin Route
router.post('/signin', validateSignin, authController.signin);

// Protected route to fetch user data
router.get('/data', authMiddleware.protect, async (req, res) => {
  try {
    // Assuming `req.user` is set by the authMiddleware (it contains the user's ID)
    const user = await User.findById(req.user.id).populate('courses'); // Populate courses if needed
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send user data back
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      courses: user.courses,
      recentlyVisitedCourses: user.recentlyVisitedCourses,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
