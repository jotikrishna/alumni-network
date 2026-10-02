import React, { useState } from 'react';
import API from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields before sending.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/contact', formData);
      setSuccess(res.data?.message || 'Message sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page section-container">
      {/* Header */}
      <div className="page-header text-center">
        <span className="badge-pill">Alumni Office Support</span>
        <h1 className="page-title">Contact AlumniConnect</h1>
        <p className="page-subtitle">Have questions about registration, upcoming events, or institutional partnerships? Get in touch with us.</p>
      </div>

      <div className="grid-2 my-8">
        {/* Contact Information Panel */}
        <div className="card shadow-card contact-info-panel">
          <h3><MessageSquare size={24} className="text-accent inline-icon" /> Get In Touch</h3>
          <p className="panel-intro">
            Our Alumni Relations team is available Monday through Friday to assist you with account verification, event hosting, and career services.
          </p>

          <div className="contact-method-card">
            <div className="method-icon-bg">
              <MapPin size={22} />
            </div>
            <div>
              <h4>Campus Location</h4>
              <p>Alumni Center, Building 4, University Quad, CA 94043</p>
            </div>
          </div>

          <div className="contact-method-card">
            <div className="method-icon-bg">
              <Mail size={22} />
            </div>
            <div>
              <h4>Email Support</h4>
              <p>alumni-support@university.edu</p>
            </div>
          </div>

          <div className="contact-method-card">
            <div className="method-icon-bg">
              <Phone size={22} />
            </div>
            <div>
              <h4>Phone Line</h4>
              <p>+1 (555) 019-2834 (Mon-Fri, 9am - 5pm)</p>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="card shadow-card contact-form-card">
          <h3>Send Us a Message</h3>

          {success && (
            <div className="alert alert-success my-4">
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger my-4">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="contact-name">Your Full Name *</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Email Address *</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject *</label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Alumni Card Request / Event Inquiry"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your inquiry or feedback here..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              <Send size={16} /> {loading ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
