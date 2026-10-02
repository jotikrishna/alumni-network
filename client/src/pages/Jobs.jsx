import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Search, PlusCircle, ExternalLink, MapPin, Building, Trash2, Edit3, X, CheckCircle, AlertCircle } from 'lucide-react';

const Jobs = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    description: '',
    applicationUrl: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

  useEffect(() => {
    fetchJobs();
  }, [search, jobTypeFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (jobTypeFilter) queryParams.append('jobType', jobTypeFilter);

      const res = await API.get(`/jobs?${queryParams.toString()}`);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (job = null) => {
    setFormError('');
    setFormSuccess('');
    if (job) {
      setEditingJobId(job._id);
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        description: job.description,
        applicationUrl: job.applicationUrl || ''
      });
    } else {
      setEditingJobId(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        jobType: 'Full-time',
        description: '',
        applicationUrl: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJobId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setFormError('Please fill in all required job fields.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingJobId) {
        await API.put(`/jobs/${editingJobId}`, formData);
        setFormSuccess('Job updated successfully');
      } else {
        await API.post('/jobs', formData);
        setFormSuccess('Job posted successfully');
      }
      setTimeout(() => {
        handleCloseModal();
        fetchJobs();
      }, 1000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save job posting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting job');
    }
  };

  return (
    <div className="jobs-page section-container">
      {/* Header */}
      <div className="page-header text-center">
        <span className="badge-pill">Alumni Career Hub</span>
        <h1 className="page-title">Explore & Post Job Opportunities</h1>
        <p className="page-subtitle">Discover career opportunities shared by university alumni or recruit top talent.</p>
      </div>

      {/* Top Actions & Filter Bar */}
      <div className="filter-bar-card">
        <div className="filter-grid">
          <div className="filter-item search-box">
            <label><Search size={16} /> Search Jobs</label>
            <input
              type="text"
              placeholder="Search title, company, skills, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label><Briefcase size={16} /> Job Type</label>
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <option value="">All Job Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-item flex-end">
            {isAuthenticated ? (
              <button onClick={() => handleOpenModal()} className="btn btn-primary btn-full">
                <PlusCircle size={18} /> Post a Job
              </button>
            ) : (
              <p className="auth-notice-text">Log in to post a new job opportunity.</p>
            )}
          </div>
        </div>
      </div>

      {/* Job Postings Grid */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading job postings...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="cards-grid-2 my-8">
          {jobs.map((job) => {
            const isOwner = user && job.postedBy && (job.postedBy._id === user._id || job.postedBy === user._id);
            return (
              <div key={job._id} className="card job-item-card shadow-card">
                <div className="job-card-header">
                  <div>
                    <span className="job-type-pill">{job.jobType}</span>
                    <h3 className="job-card-title">{job.title}</h3>
                    <p className="company-name">
                      <Building size={16} className="inline-icon" /> {job.company}
                    </p>
                  </div>
                  {isOwner && (
                    <div className="owner-actions">
                      <button onClick={() => handleOpenModal(job)} className="icon-action-btn" title="Edit Job">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteJob(job._id)} className="icon-action-btn danger" title="Delete Job">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="job-card-body">
                  <p className="location-line">
                    <MapPin size={16} className="text-accent inline-icon" /> {job.location}
                  </p>
                  <p className="job-description-text">{job.description}</p>
                </div>

                <div className="job-card-footer">
                  <div className="poster-info">
                    <img
                      src={job.postedBy?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                      alt={job.postedBy?.name || 'Poster'}
                      className="poster-avatar"
                    />
                    <div>
                      <span className="poster-name">{job.postedBy?.name || 'Alumnus'}</span>
                      <span className="posted-date">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {job.applicationUrl ? (
                    <a
                      href={job.applicationUrl.startsWith('http') ? job.applicationUrl : `https://${job.applicationUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Apply Now <ExternalLink size={14} />
                    </a>
                  ) : (
                    <a
                      href={`mailto:${job.postedBy?.email || ''}`}
                      className="btn btn-outline btn-sm"
                    >
                      Contact Poster
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-box">
          <Briefcase size={48} className="empty-icon" />
          <h3>No jobs available</h3>
          <p>Check back later or post a job to connect with alumni candidates.</p>
        </div>
      )}

      {/* Create / Edit Job Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header">
              <h2>{editingJobId ? 'Edit Job Posting' : 'Post a Job Opportunity'}</h2>
              <button onClick={handleCloseModal} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="alert alert-success">
                <CheckCircle size={18} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Google, TechCorp"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote / San Francisco, CA"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Description *</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe job responsibilities, skills, and qualifications..."
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Application URL / Link (Optional)</label>
                <input
                  type="url"
                  value={formData.applicationUrl}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  placeholder="https://example.com/careers/apply"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingJobId ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
