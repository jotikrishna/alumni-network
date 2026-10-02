const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { search, jobType } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (jobType) {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email company jobTitle profileImage')
      .sort({ createdAt: -1 });

    return res.json(jobs);
  } catch (error) {
    console.error('getJobs Error:', error);
    return res.status(500).json({ message: 'Error fetching jobs' });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email company jobTitle profileImage');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.json(job);
  } catch (error) {
    console.error('getJobById Error:', error);
    return res.status(500).json({ message: 'Error fetching job details' });
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const { title, company, location, jobType, description, applicationUrl } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: 'Please provide title, company, location, and description' });
    }

    const job = await Job.create({
      title,
      company,
      location,
      jobType: jobType || 'Full-time',
      description,
      applicationUrl: applicationUrl || '',
      postedBy: req.user._id
    });

    const populatedJob = await Job.findById(job._id).populate('postedBy', 'name email company jobTitle profileImage');

    return res.status(201).json({
      message: 'Job posted successfully',
      job: populatedJob
    });
  } catch (error) {
    console.error('createJob Error:', error);
    return res.status(500).json({ message: error.message || 'Error posting job' });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job owner or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this job' });
    }

    const { title, company, location, jobType, description, applicationUrl } = req.body;

    if (title) job.title = title;
    if (company) job.company = company;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (description) job.description = description;
    if (applicationUrl !== undefined) job.applicationUrl = applicationUrl;

    const updatedJob = await job.save();
    const populatedJob = await Job.findById(updatedJob._id).populate('postedBy', 'name email company jobTitle profileImage');

    return res.json({
      message: 'Job updated successfully',
      job: populatedJob
    });
  } catch (error) {
    console.error('updateJob Error:', error);
    return res.status(500).json({ message: 'Error updating job' });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    return res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    console.error('deleteJob Error:', error);
    return res.status(500).json({ message: 'Error deleting job' });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};
