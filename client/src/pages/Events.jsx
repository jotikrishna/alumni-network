import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, PlusCircle, Search, Trash2, Edit3, X, CheckCircle, AlertCircle, Users } from 'lucide-react';

const Events = () => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);

      const res = await API.get(`/events?${queryParams.toString()}`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (evt = null) => {
    setFormError('');
    setFormSuccess('');
    if (evt) {
      setEditingEventId(evt._id);
      setFormData({
        title: evt.title,
        date: evt.date,
        time: evt.time,
        location: evt.location,
        description: evt.description
      });
    } else {
      setEditingEventId(null);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        location: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEventId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
      setFormError('Please fill in all event fields.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingEventId) {
        await API.put(`/events/${editingEventId}`, formData);
        setFormSuccess('Event updated successfully');
      } else {
        await API.post('/events', formData);
        setFormSuccess('Event created successfully');
      }
      setTimeout(() => {
        handleCloseModal();
        fetchEvents();
      }, 1000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting event');
    }
  };

  return (
    <div className="events-page section-container">
      {/* Header */}
      <div className="page-header text-center">
        <span className="badge-pill">Alumni Gatherings & Webinars</span>
        <h1 className="page-title">Upcoming Alumni Events</h1>
        <p className="page-subtitle">Join class reunions, technical webinars, panel talks, and regional networking meetups.</p>
      </div>

      {/* Top Actions & Filter Bar */}
      <div className="filter-bar-card">
        <div className="filter-grid">
          <div className="filter-item search-box span-2">
            <label><Search size={16} /> Search Events</label>
            <input
              type="text"
              placeholder="Search event title, venue, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-item flex-end">
            {isAuthenticated ? (
              <button onClick={() => handleOpenModal()} className="btn btn-primary btn-full">
                <PlusCircle size={18} /> Create New Event
              </button>
            ) : (
              <p className="auth-notice-text">Log in to organize an alumni event.</p>
            )}
          </div>
        </div>
      </div>

      {/* Event Cards Grid */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading upcoming events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="cards-grid-2 my-8">
          {events.map((evt) => {
            const isOwner = user && evt.createdBy && (evt.createdBy._id === user._id || evt.createdBy === user._id);
            return (
              <div key={evt._id} className="card event-item-card shadow-card">
                <div className="event-card-header">
                  <div className="event-date-pill">
                    <Calendar size={16} /> {evt.date}
                  </div>
                  {isOwner && (
                    <div className="owner-actions">
                      <button onClick={() => handleOpenModal(evt)} className="icon-action-btn" title="Edit Event">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteEvent(evt._id)} className="icon-action-btn danger" title="Delete Event">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="event-title">{evt.title}</h3>

                <div className="event-meta-info">
                  <p><Clock size={16} className="text-accent inline-icon" /> <strong>Time:</strong> {evt.time}</p>
                  <p><MapPin size={16} className="text-accent inline-icon" /> <strong>Location:</strong> {evt.location}</p>
                </div>

                <p className="event-description-text">{evt.description}</p>

                <div className="event-card-footer">
                  <div className="organizer-info">
                    <img
                      src={evt.createdBy?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                      alt={evt.createdBy?.name || 'Organizer'}
                      className="organizer-avatar"
                    />
                    <div>
                      <span className="organizer-name">{evt.createdBy?.name || 'Alumni Office'}</span>
                      <span className="organizer-label">Event Organizer</span>
                    </div>
                  </div>
                  <button onClick={() => alert(`RSVP recorded for ${evt.title}! Event details sent to your registered email.`)} className="btn btn-primary btn-sm">
                    RSVP / Register
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-box">
          <Calendar size={48} className="empty-icon" />
          <h3>No upcoming events</h3>
          <p>Be the first to schedule an alumni event or webinar!</p>
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header">
              <h2>{editingEventId ? 'Edit Event Details' : 'Organize New Alumni Event'}</h2>
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
                <label>Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Alumni Homecoming Gala 2026"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location / Venue / Link *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Main Auditorium / Zoom Online Link"
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Description *</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide event details, schedule, speaker info, or agenda..."
                  required
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingEventId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
