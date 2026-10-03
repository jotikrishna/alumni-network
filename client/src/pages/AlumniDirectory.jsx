import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, Filter, Briefcase, GraduationCap, MapPin, ExternalLink, User } from 'lucide-react';

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  const departments = [
    'All Departments',
    'Computer Science',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Data Science'
  ];

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    fetchAlumni();
  }, [search, department, graduationYear]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      let queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (department && department !== 'All Departments') queryParams.append('department', department);
      if (graduationYear) queryParams.append('graduationYear', graduationYear);

      const res = await API.get(`/users?${queryParams.toString()}`);
      setAlumni(res.data);
    } catch (err) {
      console.error('Error fetching alumni:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('');
    setGraduationYear('');
  };

  return (
    <div className="alumni-directory-page section-container">
      {/* Header */}
      <div className="page-header text-center">
        <span className="badge-pill">Alumni Directory</span>
        <h1 className="page-title">Discover & Connect With Alumni</h1>
        <p className="page-subtitle">Search registered graduates by name, company, department, or graduation year.</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="filter-bar-card">
        <div className="filter-grid">
          {/* Search Box */}
          <div className="filter-item search-box">
            <label><Search size={16} /> Search</label>
            <input
              type="text"
              placeholder="Search by name, company, or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Dropdown */}
          <div className="filter-item">
            <label><GraduationCap size={16} /> Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept === 'All Departments' ? '' : dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Graduation Year Dropdown */}
          <div className="filter-item">
            <label><Filter size={16} /> Graduation Year</label>
            <select
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
            >
              <option value="">All Graduation Years</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(search || department || graduationYear) && (
          <div className="clear-filters-row">
            <button onClick={clearFilters} className="btn btn-sm btn-outline">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Alumni Cards Grid */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading alumni directory...</p>
        </div>
      ) : alumni.length > 0 ? (
        <div className="cards-grid-3 my-8">
          {alumni.map((person) => (
            <div key={person._id} className="card alumnus-card shadow-card">
              <div className="alumnus-card-header">
                <img
                  src={person.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={person.name}
                  className="alumnus-avatar"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'; }}
                />
                <div className="alumnus-title-info">
                  <h3>{person.name}</h3>
                  <p className="job-headline">
                    {person.jobTitle ? `${person.jobTitle}` : 'Alumnus'}
                  </p>
                </div>
              </div>

              <div className="alumnus-card-body">
                <div className="info-badge-row">
                  <span className="badge-sm bg-dept">{person.department}</span>
                  <span className="badge-sm bg-year">Class of {person.graduationYear}</span>
                </div>

                <div className="detail-line">
                  <Briefcase size={16} className="text-accent" />
                  <span>{person.company || 'Company not specified'}</span>
                </div>

                <div className="detail-line">
                  <MapPin size={16} className="text-accent" />
                  <span>{person.location || 'Location not specified'}</span>
                </div>

                {person.skills && person.skills.length > 0 && (
                  <div className="skills-tags">
                    {person.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-chip">{skill}</span>
                    ))}
                    {person.skills.length > 3 && (
                      <span className="skill-chip more">+{person.skills.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="alumnus-card-footer">
                <Link to={`/alumni/${person._id}`} className="btn btn-primary btn-full">
                  View Full Profile <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-box">
          <User size={48} className="empty-icon" />
          <h3>No alumni found</h3>
          <p>Try adjusting your search query or department filters to find graduates.</p>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;
