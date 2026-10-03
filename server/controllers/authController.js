const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'alumniconnect_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, graduationYear, department, company, jobTitle, location, bio, skills } = req.body;

    // Validation
    if (!name || !email || !password || !graduationYear || !department) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Email, Password, Department, Graduation Year)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists. Please login instead.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in MongoDB Atlas
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      graduationYear: Number(graduationYear),
      department: String(department).trim(),
      company: company ? String(company).trim() : '',
      jobTitle: jobTitle ? String(jobTitle).trim() : '',
      location: location ? String(location).trim() : '',
      bio: bio ? String(bio).trim() : '',
      skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map(s => s.trim()).filter(Boolean) : [])
    });

    if (user) {
      const token = generateToken(user._id);
      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          graduationYear: user.graduationYear,
          company: user.company,
          jobTitle: user.jobTitle,
          location: user.location,
          bio: user.bio,
          skills: user.skills,
          profileImage: user.profileImage
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received. Unable to save profile.' });
    }
  } catch (error) {
    console.error('Register Controller Error:', error.message || error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Find user by email in MongoDB Atlas
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'No account found with this email address. Please check your email or register.' });
    }

    // Check password match using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please verify your password and try again.' });
    }

    const token = generateToken(user._id);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        graduationYear: user.graduationYear,
        company: user.company,
        jobTitle: user.jobTitle,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login Controller Error:', error.message || error);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('getMe Controller Error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching user profile' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
