import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="footer-logo">
              <GraduationCap size={28} className="text-accent" />
              <span className="footer-title">AlumniConnect</span>
            </div>
            <p className="footer-subtitle">"Connect. Network. Grow."</p>
            <p className="footer-desc">
              Building lifelong connections between university graduates, current students, and faculty. Discover career growth opportunities, attend events, and share knowledge.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/alumni">Alumni Directory</Link></li>
              <li><Link to="/jobs">Job Opportunities</Link></li>
              <li><Link to="/events">Upcoming Events</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="footer-column">
            <h4>Account & Portals</h4>
            <ul>
              <li><Link to="/login">Alumni Login</Link></li>
              <li><Link to="/register">Register Account</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-column">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <MapPin size={16} />
              <span>University Alumni Relations Office, Campus Drive</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>alumni@university.edu</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+1 (555) 019-2834</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
          <p className="footer-credit">Designed with <Heart size={14} className="heart-icon" /> for Alumni & Students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
