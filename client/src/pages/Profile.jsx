import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, GraduationCap, Briefcase, MapPin, Edit3, CheckCircle, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || 'Computer Science',
    graduationYear: user?.graduationYear || 2021,
    company: user?.company || '',
    jobTitle: user?.jobTitle || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills ? user.skills.join(', ') : '',
    profileImage: user?.profileImage || ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Data Science'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      setSaving(true);
      await updateUser(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page section-container">
      <div className="profile-card-container card shadow-card">
        <div className="profile-card-header">
          <div className="avatar-wrapper">
            <img
              src={formData.profileImage || user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="user-profile-avatar"
            />
          </div>
          <div className="header-info">
            <h2>{user?.name}</h2>
            <p className="email-line"><Mail size={16} /> {user?.email}</p>
            <span className="badge-pill mt-2">
              <GraduationCap size={14} /> {user?.department} • Class of {user?.graduationYear}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn ${isEditing ? 'btn-outline' : 'btn-primary'} edit-toggle-btn`}
          >
            <Edit3 size={16} /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {message && (
          <div className="alert alert-success my-4">
            <CheckCircle size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger my-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-edit-form my-6">
            <h3>Edit Profile Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google, Microsoft"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Product Manager"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="form-group">
              <label>Bio / About Yourself</label>
              <textarea
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share your career highlights, achievements, or interests..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Skills (Comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Leadership, Python"
              />
            </div>

            <div className="form-actions-row">
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view-details my-6">
            <div className="view-grid">
              <div className="view-box">
                <h4><User size={18} className="text-accent inline-icon" /> Full Name</h4>
                <p>{user?.name}</p>
              </div>

              <div className="view-box">
                <h4><Mail size={18} className="text-accent inline-icon" /> Email Address</h4>
                <p>{user?.email}</p>
              </div>

              <div className="view-box">
                <h4><GraduationCap size={18} className="text-accent inline-icon" /> Academic Details</h4>
                <p>{user?.department} • Class of {user?.graduationYear}</p>
              </div>

              <div className="view-box">
                <h4><Briefcase size={18} className="text-accent inline-icon" /> Professional Role</h4>
                <p>{user?.jobTitle ? `${user.jobTitle} at ${user.company || 'N/A'}` : (user?.company || 'Not specified')}</p>
              </div>

              <div className="view-box">
                <h4><MapPin size={18} className="text-accent inline-icon" /> Location</h4>
                <p>{user?.location || 'Not specified'}</p>
              </div>

              <div className="view-box full-width">
                <h4>Short Biography</h4>
                <p className="bio-text">{user?.bio || 'No biography provided. Click Edit Profile to add one.'}</p>
              </div>

              <div className="view-box full-width">
                <h4>Skills & Expertise</h4>
                {user?.skills && user.skills.length > 0 ? (
                  <div className="skills-tags-full mt-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-chip-lg">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
