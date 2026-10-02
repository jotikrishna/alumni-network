import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Users, Briefcase, Calendar, UserCheck, PlusCircle, ArrowRight, Building, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalAlumni: 0, totalJobs: 0, totalEvents: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, jobsRes, eventsRes] = await Promise.all([
          API.get('/users'),
          API.get('/jobs'),
          API.get('/events')
        ]);

        setStats({
          totalAlumni: usersRes.data.length,
          totalJobs: jobsRes.data.length,
          totalEvents: eventsRes.data.length
        });

        setRecentJobs(jobsRes.data.slice(0, 4));
        setUpcomingEvents(eventsRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page section-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-card">
        <div className="welcome-text">
          <h1>Welcome, {user?.name || 'Alumnus'}! 👋</h1>
          <p>
            {user?.jobTitle ? `${user.jobTitle} at ${user.company}` : `${user?.department} • Class of ${user?.graduationYear}`}
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/profile" className="btn btn-outline">
            Edit Profile
          </Link>
          <Link to="/jobs" className="btn btn-primary">
            Post a Job
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="cards-grid-3 my-8">
        <div className="metric-card">
          <div className="metric-icon-bg bg-blue">
            <Users size={28} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{loading ? '...' : stats.totalAlumni}</span>
            <span className="metric-label">Total Alumni Registered</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-bg bg-indigo">
            <Briefcase size={28} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{loading ? '...' : stats.totalJobs}</span>
            <span className="metric-label">Available Job Opportunities</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-bg bg-emerald">
            <Calendar size={28} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{loading ? '...' : stats.totalEvents}</span>
            <span className="metric-label">Upcoming Alumni Events</span>
          </div>
        </div>
      </div>

      {/* Dashboard Sections Grid */}
      <div className="grid-2 my-8">
        {/* Recent Jobs Section */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3><Briefcase size={20} className="text-accent inline-icon" /> Recent Job Postings</h3>
            <Link to="/jobs" className="link-btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="spinner"></div>
          ) : recentJobs.length > 0 ? (
            <div className="panel-list">
              {recentJobs.map((job) => (
                <div key={job._id} className="panel-item">
                  <div className="panel-item-main">
                    <h4>{job.title}</h4>
                    <p className="subtext">
                      <Building size={14} className="inline-icon" /> {job.company} • <MapPin size={14} className="inline-icon" /> {job.location}
                    </p>
                  </div>
                  <span className="badge-sm">{job.jobType}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-msg">No recent jobs available.</p>
          )}
        </div>

        {/* Upcoming Events Section */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3><Calendar size={20} className="text-accent inline-icon" /> Upcoming Events</h3>
            <Link to="/events" className="link-btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="spinner"></div>
          ) : upcomingEvents.length > 0 ? (
            <div className="panel-list">
              {upcomingEvents.map((evt) => (
                <div key={evt._id} className="panel-item">
                  <div className="panel-item-main">
                    <h4>{evt.title}</h4>
                    <p className="subtext">📅 {evt.date} at {evt.time} • 📍 {evt.location}</p>
                  </div>
                  <Link to="/events" className="btn btn-sm btn-outline">Details</Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-msg">No upcoming events scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
