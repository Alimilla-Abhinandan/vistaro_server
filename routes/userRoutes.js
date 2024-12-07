// routes/usersRoutes.js
const express = require('express');
const User = require('../models/userModel');  // Assuming User model is in '../models/User'
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate using JWT token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    req.user = decoded;  // Attach the decoded user info to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Fetch user data
router.get('/data', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('courses');  // Ensure courses are populated if needed
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      courses: user.courses,
      recentlyVisitedCourses: user.recentlyVisitedCourses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
