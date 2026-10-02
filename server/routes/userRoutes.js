const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllUsers);
router.put('/profile', protect, updateProfile);
router.get('/:id', getUserById);

module.exports = router;
