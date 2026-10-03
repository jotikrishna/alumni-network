import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  ShieldCheck,
  UserX,
  Trash2,
  RefreshCw,
  Mail,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchAdminData = async () => {
    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const [statsRes, usersRes, jobsRes, eventsRes, messagesRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/jobs'),
        API.get('/events'),
        API.get('/admin/messages')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
      setEvents(eventsRes.data);
      setMessages(messagesRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Failed to load admin data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setFeedback({ type: 'success', text: res.data.message });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Failed to update user role' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}" and all their postings?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await API.delete(`/admin/users/${userId}`);
      setFeedback({ type: 'success', text: res.data.message });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Failed to delete user' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete job posting "${jobTitle}"?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await API.delete(`/jobs/${jobId}`);
      setFeedback({ type: 'success', text: res.data.message || 'Job deleted successfully' });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Failed to delete job' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete event "${eventTitle}"?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await API.delete(`/events/${eventId}`);
      setFeedback({ type: 'success', text: res.data.message || 'Event deleted successfully' });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Failed to delete event' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this contact inquiry?')) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await API.delete(`/admin/messages/${messageId}`);
      setFeedback({ type: 'success', text: res.data.message });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Failed to delete message' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-page section-container">
      {/* Header Banner */}
      <div className="dashboard-welcome-card admin-header-card">
        <div className="welcome-text">
          <div className="admin-badge-title">
            <ShieldCheck size={28} className="admin-icon" />
            <h1>Admin Control Center</h1>
          </div>
          <p>Logged in as <strong>{user?.name}</strong> ({user?.email}) • Administrator</p>
        </div>
        <div className="welcome-actions">
          <button onClick={fetchAdminData} className="btn btn-outline icon-btn" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh Data
          </button>
        </div>
      </div>

      {feedback.text && (
        <div className={`alert alert-${feedback.type} mt-4`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs-container">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <ShieldAlert size={18} /> Overview
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> Users ({users.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={18} /> Jobs ({jobs.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={18} /> Events ({events.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={18} /> Inquiries ({messages.length})
        </button>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading Admin Metrics & Data...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="admin-tab-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon bg-primary-light text-primary">
                    <Users size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalUsers || 0}</h3>
                    <p>Total Registered Alumni</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon bg-accent-light text-accent">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalAdmins || 0}</h3>
                    <p>System Administrators</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon bg-warning-light text-warning">
                    <Briefcase size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalJobs || 0}</h3>
                    <p>Active Job Listings</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon bg-info-light text-info">
                    <Calendar size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalEvents || 0}</h3>
                    <p>Upcoming Events</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon bg-danger-light text-danger">
                    <MessageSquare size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stats?.totalMessages || 0}</h3>
                    <p>Contact Inquiries</p>
                  </div>
                </div>
              </div>

              {/* Recent Registrations Table */}
              <div className="admin-card mt-6">
                <div className="admin-card-header">
                  <h3>Recent Alumni Registrations</h3>
                  <button className="btn btn-sm btn-outline" onClick={() => setActiveTab('users')}>
                    View All Users
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Department</th>
                        <th>Class</th>
                        <th>Company / Title</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentUsers?.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div className="user-cell">
                              <img
                                src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                                alt={u.name}
                                className="table-avatar"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'; }}
                              />
                              <div>
                                <strong>{u.name}</strong>
                                <div className="text-muted text-sm">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{u.department}</td>
                          <td>{u.graduationYear}</td>
                          <td>{u.company ? `${u.jobTitle} at ${u.company}` : 'N/A'}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>User Accounts Management</h3>
                  <span className="text-muted text-sm">{users.length} total users registered</span>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name & Email</th>
                        <th>Department & Class</th>
                        <th>Company / Role</th>
                        <th>System Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div className="user-cell">
                              <img
                                src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                                alt={u.name}
                                className="table-avatar"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'; }}
                              />
                              <div>
                                <strong>{u.name}</strong>
                                <div className="text-muted text-sm">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>{u.department}</div>
                            <small className="text-muted">Class of {u.graduationYear}</small>
                          </td>
                          <td>{u.company ? `${u.jobTitle} @ ${u.company}` : 'Unspecified'}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleRoleChange(u._id, u.role)}
                                disabled={actionLoading || u._id === user?._id}
                                className="btn btn-sm btn-outline"
                                title="Toggle Role (Admin / User)"
                              >
                                {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                              </button>
                              {u._id !== user?._id && (
                                <button
                                  onClick={() => handleDeleteUser(u._id, u.name)}
                                  disabled={actionLoading}
                                  className="btn btn-sm btn-danger icon-btn"
                                  title="Delete User"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JOBS MANAGEMENT */}
          {activeTab === 'jobs' && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Job Postings Moderation</h3>
                  <span className="text-muted text-sm">{jobs.length} job listings total</span>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Job Title & Company</th>
                        <th>Type & Location</th>
                        <th>Posted By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job._id}>
                          <td>
                            <strong>{job.title}</strong>
                            <div className="text-muted text-sm"><Building size={14} style={{display:'inline', marginRight:4}} />{job.company}</div>
                          </td>
                          <td>
                            <span className="badge badge-info">{job.jobType}</span>
                            <div className="text-muted text-sm mt-1">{job.location}</div>
                          </td>
                          <td>
                            {job.postedBy ? (
                              <span>{job.postedBy.name} ({job.postedBy.email})</span>
                            ) : (
                              <span className="text-muted">Unknown User</span>
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteJob(job._id, job.title)}
                              disabled={actionLoading}
                              className="btn btn-sm btn-danger icon-btn"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVENTS MANAGEMENT */}
          {activeTab === 'events' && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Alumni Events Management</h3>
                  <span className="text-muted text-sm">{events.length} events scheduled</span>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Event Title</th>
                        <th>Date & Time</th>
                        <th>Location</th>
                        <th>Organized By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((evt) => (
                        <tr key={evt._id}>
                          <td>
                            <strong>{evt.title}</strong>
                            <p className="text-muted text-sm truncate-text" style={{maxWidth: 260}}>{evt.description}</p>
                          </td>
                          <td>
                            <div>{evt.date}</div>
                            <small className="text-muted">{evt.time}</small>
                          </td>
                          <td>{evt.location}</td>
                          <td>{evt.createdBy ? evt.createdBy.name : 'System Admin'}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteEvent(evt._id, evt.title)}
                              disabled={actionLoading}
                              className="btn btn-sm btn-danger icon-btn"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT INQUIRIES */}
          {activeTab === 'messages' && (
            <div className="admin-tab-content">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Received Contact Inquiries</h3>
                  <span className="text-muted text-sm">{messages.length} messages received</span>
                </div>
                {messages.length === 0 ? (
                  <div className="empty-state">
                    <Mail size={40} className="text-muted" />
                    <p className="mt-2">No contact form inquiries submitted yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Sender</th>
                          <th>Subject</th>
                          <th>Message Body</th>
                          <th>Submitted Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg) => (
                          <tr key={msg._id}>
                            <td>
                              <strong>{msg.name}</strong>
                              <div className="text-muted text-sm">{msg.email}</div>
                            </td>
                            <td><strong>{msg.subject}</strong></td>
                            <td>
                              <p className="message-text-cell">{msg.message}</p>
                            </td>
                            <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                disabled={actionLoading}
                                className="btn btn-sm btn-danger icon-btn"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
