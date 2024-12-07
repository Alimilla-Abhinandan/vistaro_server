// controllers/userController.js
const User = require('../models/User');

// Fetch user data by user ID (using authentication middleware)
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('courses') // Populating courses data (assuming it's a reference to a Course model)
      .populate('recentlyVisitedCourses'); // Populating recently visited courses
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      courses: user.courses, // Array of course objects
      recentlyVisitedCourses: user.recentlyVisitedCourses // Array of course objects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};
