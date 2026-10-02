const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get user's conversations list with latest message & unread count
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    }).sort({ createdAt: -1 });

    // Extract unique partner IDs
    const partnerIds = [];
    const partnerMap = new Map();

    for (const msg of messages) {
      const isSender = msg.sender.toString() === currentUserId.toString();
      const partnerId = isSender ? msg.receiver.toString() : msg.sender.toString();

      if (!partnerMap.has(partnerId)) {
        partnerMap.set(partnerId, {
          lastMessage: msg,
          unreadCount: 0
        });
        partnerIds.push(partnerId);
      }

      if (!isSender && !msg.read) {
        partnerMap.get(partnerId).unreadCount += 1;
      }
    }

    // Fetch details of all partner users
    const partners = await User.find({ _id: { $in: partnerIds } })
      .select('name email profileImage department graduationYear company jobTitle location');

    // Build conversations response
    const conversations = partners.map((partner) => {
      const data = partnerMap.get(partner._id.toString());
      return {
        user: partner,
        lastMessage: data ? data.lastMessage : null,
        unreadCount: data ? data.unreadCount : 0
      };
    });

    // Sort by latest message date descending
    conversations.sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : 0;
      const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : 0;
      return dateB - dateA;
    });

    return res.json(conversations);
  } catch (error) {
    console.error('getConversations Error:', error);
    return res.status(500).json({ message: 'Error fetching conversations list' });
  }
};

// @desc    Get message history with a specific alumnus
// @route   GET /api/messages/:userId
// @access  Private
const getMessagesWithUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    // Check if target user exists
    const targetUser = await User.findById(targetUserId).select('name email profileImage department graduationYear company jobTitle');
    if (!targetUser) {
      return res.status(404).json({ message: 'Alumnus not found' });
    }

    // Fetch messages exchanged between current user and target user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId }
      ]
    })
      .populate('sender', 'name email profileImage')
      .populate('receiver', 'name email profileImage')
      .sort({ createdAt: 1 });

    // Mark messages sent by target user to current user as read
    await Message.updateMany(
      { sender: targetUserId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    return res.json({
      partner: targetUser,
      messages
    });
  } catch (error) {
    console.error('getMessagesWithUser Error:', error);
    return res.status(500).json({ message: 'Error fetching message history' });
  }
};

// @desc    Send a message to an alumnus
// @route   POST /api/messages/:userId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;
    const { message } = req.body;

    // Validation checks
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    if (currentUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: 'You cannot send messages to yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Recipient alumnus not found' });
    }

    // Create and save message
    const newMessage = await Message.create({
      sender: currentUserId,
      receiver: targetUserId,
      message: message.trim(),
      read: false
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email profileImage')
      .populate('receiver', 'name email profileImage');

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('sendMessage Error:', error);
    return res.status(500).json({ message: error.message || 'Error sending message' });
  }
};

// @desc    Delete a sent message
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.deleteOne();

    return res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('deleteMessage Error:', error);
    return res.status(500).json({ message: 'Error deleting message' });
  }
};

// @desc    Get total unread messages count
// @route   GET /api/messages/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });
    return res.json({ unreadCount: count });
  } catch (error) {
    console.error('getUnreadCount Error:', error);
    return res.status(500).json({ message: 'Error fetching unread count' });
  }
};

module.exports = {
  getConversations,
  getMessagesWithUser,
  sendMessage,
  deleteMessage,
  getUnreadCount
};
