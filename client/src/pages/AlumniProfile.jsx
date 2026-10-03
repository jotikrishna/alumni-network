import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Briefcase, GraduationCap, MapPin, Mail, ArrowLeft, Award, User, CheckCircle2, MessageSquare } from 'lucide-react';

const AlumniProfile = () => {
  const { id } = useParams();
  const [alumnus, setAlumnus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlumnusProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/users/${id}`);
        setAlumnus(res.data);
      } catch (err) {
        console.error('Error loading alumnus profile:', err);
        setError('Alumnus profile not found or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnusProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading profile details...</p>
      </div>
    );
  }

  if (error || !alumnus) {
    return (
      <div className="section-container text-center my-12">
        <h2>Profile Not Found</h2>
        <p className="text-secondary mb-6">{error || 'The requested profile does not exist.'}</p>
        <Link to="/alumni" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="alumni-profile-page section-container">
      <Link to="/alumni" className="back-link mb-6">
        <ArrowLeft size={18} /> Back to Alumni Directory
      </Link>

      <div className="profile-banner-card shadow-card">
        <div className="profile-hero-flex">
          <img
            src={alumnus.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
            alt={alumnus.name}
            className="profile-large-avatar"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'; }}
          />
          <div className="profile-hero-info">
            <h1>{alumnus.name}</h1>
            <p className="profile-sub-title">
              {alumnus.jobTitle ? `${alumnus.jobTitle}` : 'Alumnus'} {alumnus.company && `at ${alumnus.company}`}
            </p>
            <div className="meta-pills-row mt-3">
              <span className="badge-pill-outline">
                <GraduationCap size={16} /> {alumnus.department} • Class of {alumnus.graduationYear}
              </span>
              {alumnus.location && (
                <span className="badge-pill-outline">
                  <MapPin size={16} /> {alumnus.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-details-grid my-8">
          {/* Bio Section */}
          <div className="profile-section">
            <h3><User size={20} className="text-accent inline-icon" /> About / Biography</h3>
            <p className="bio-text">
              {alumnus.bio || 'No biography provided yet.'}
            </p>
          </div>

          {/* Professional Overview */}
          <div className="profile-section">
            <h3><Briefcase size={20} className="text-accent inline-icon" /> Current Role & Work</h3>
            <div className="work-info-box">
              <p><strong>Company:</strong> {alumnus.company || 'Not specified'}</p>
              <p><strong>Job Title:</strong> {alumnus.jobTitle || 'Not specified'}</p>
              <p><strong>Location:</strong> {alumnus.location || 'Not specified'}</p>
            </div>
          </div>

          {/* Skills Badges */}
          <div className="profile-section">
            <h3><Award size={20} className="text-accent inline-icon" /> Skills & Expertise</h3>
            {alumnus.skills && alumnus.skills.length > 0 ? (
              <div className="skills-tags-full">
                {alumnus.skills.map((skill, index) => (
                  <span key={index} className="skill-chip-lg">
                    <CheckCircle2 size={14} className="text-accent" /> {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-secondary">No skills listed.</p>
            )}
          </div>

          {/* Contact Option */}
          <div className="profile-section">
            <h3><Mail size={20} className="text-accent inline-icon" /> Connect & Communicate</h3>
            <p className="mb-4">Send a direct message on AlumniConnect or contact via email:</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to={`/messages/${alumnus._id}`} className="btn btn-primary inline-btn">
                <MessageSquare size={16} /> Send Private Message
              </Link>
              <a href={`mailto:${alumnus.email}`} className="btn btn-outline inline-btn">
                <Mail size={16} /> Send Email ({alumnus.email})
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;
