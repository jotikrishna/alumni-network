const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/', protect, createJob);
router.get('/:id', getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
