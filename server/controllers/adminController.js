const User = require('../models/User');
const Job = require('../models/Job');
const Event = require('../models/Event');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalJobs = await Job.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalMessages = await ContactMessage.countDocuments();

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      totalUsers,
      totalAdmins,
      totalJobs,
      totalEvents,
      totalMessages,
      recentUsers
    });
  } catch (error) {
    console.error('getAdminStats Error:', error);
    return res.status(500).json({ message: 'Error fetching admin statistics' });
  }
};

// @desc    Get all users list (Admin view)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error('getAllUsersAdmin Error:', error);
    return res.status(500).json({ message: 'Error fetching users list' });
  }
};

// @desc    Update user role (promote/demote admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent demoting yourself if you are an admin
    if (targetUser._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot revoke your own admin rights' });
    }

    targetUser.role = role;
    await targetUser.save();

    const updated = targetUser.toObject();
    delete updated.password;

    return res.json({
      message: `User role updated to ${role} successfully`,
      user: updated
    });
  } catch (error) {
    console.error('updateUserRole Error:', error);
    return res.status(500).json({ message: 'Error updating user role' });
  }
};

// @desc    Delete user account (Admin override)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUserAdmin = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    await Job.deleteMany({ postedBy: targetUser._id });
    await Event.deleteMany({ createdBy: targetUser._id });
    await targetUser.deleteOne();

    return res.json({ message: 'User account and associated records deleted successfully' });
  } catch (error) {
    console.error('deleteUserAdmin Error:', error);
    return res.status(500).json({ message: 'Error deleting user' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/admin/messages
// @access  Private (Admin only)
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    console.error('getAllContactMessages Error:', error);
    return res.status(500).json({ message: 'Error fetching contact messages' });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/messages/:id
// @access  Private (Admin only)
const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    await message.deleteOne();
    return res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('deleteContactMessage Error:', error);
    return res.status(500).json({ message: 'Error deleting message' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsersAdmin,
  updateUserRole,
  deleteUserAdmin,
  getAllContactMessages,
  deleteContactMessage
};
