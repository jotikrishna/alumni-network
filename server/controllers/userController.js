const User = require('../models/User');

// @desc    Get all alumni / users with search and filters
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    const { search, department, graduationYear } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query.department = department;
    }

    if (graduationYear) {
      query.graduationYear = Number(graduationYear);
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error('getAllUsers Error:', error);
    return res.status(500).json({ message: 'Error fetching alumni list' });
  }
};

// @desc    Get alumnus by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Alumnus profile not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('getUserById Error:', error);
    return res.status(500).json({ message: 'Error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      department,
      graduationYear,
      company,
      jobTitle,
      location,
      bio,
      skills,
      profileImage
    } = req.body;

    if (name) user.name = name;
    if (department) user.department = department;
    if (graduationYear) user.graduationYear = Number(graduationYear);
    if (company !== undefined) user.company = company;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills;
      } else if (typeof skills === 'string') {
        user.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const updatedUser = await user.save();

    // Return updated user object without password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('updateProfile Error:', error);
    return res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile
};
