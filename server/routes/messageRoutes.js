const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessagesWithUser,
  sendMessage,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All message routes require authentication
router.use(protect);

router.get('/conversations', getConversations);
router.get('/unread-count', getUnreadCount);
router.get('/:userId', getMessagesWithUser);
router.post('/:userId', sendMessage);
router.delete('/:messageId', deleteMessage);

module.exports = router;
