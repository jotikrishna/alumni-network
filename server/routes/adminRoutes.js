const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsersAdmin,
  updateUserRole,
  deleteUserAdmin,
  getAllContactMessages,
  deleteContactMessage
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect all routes under /api/admin with JWT protect & admin role check
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserAdmin);
router.get('/messages', getAllContactMessages);
router.delete('/messages/:id', deleteContactMessage);

module.exports = router;
