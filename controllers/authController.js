// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      username, 
      email, 
      password, 
      confirmPassword, 
      age, 
      gender, 
      phone 
    } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      age,
      gender,
      phone
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};
// exports.logout = async (req, res) => {
//     try {
//       const token = req.headers.authorization.split(' ')[1];
//       tokenBlacklist.add(token);
  
//       res.status(200).json({ message: 'Logged out successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Logout failed', error: error.message });
//     }
//   };
  
//   exports.checkTokenBlacklist = (req, res, next) => {
//     try {
//       const token = req.headers.authorization.split(' ')[1];
  
//       if (tokenBlacklist.has(token)) {
//         return res.status(401).json({ message: 'Token is no longer valid' });
//       }
  
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Authentication failed' });
//     }
//   };