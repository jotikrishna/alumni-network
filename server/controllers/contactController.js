const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all contact fields' });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    return res.status(201).json({
      message: 'Message sent successfully.',
      contact: newMessage
    });
  } catch (error) {
    console.error('createContactMessage Error:', error);
    return res.status(500).json({ message: error.message || 'Error submitting message' });
  }
};

module.exports = {
  createContactMessage
};
