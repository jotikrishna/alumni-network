import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Menu, X, User, LogOut, Briefcase, Calendar, Users, Home, Info, Mail, ShieldCheck, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-container">
      <nav className="navbar">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <GraduationCap className="logo-icon" size={30} />
          <div className="logo-text">
            <span className="brand-title">AlumniConnect</span>
            <span className="brand-subtitle">Connect. Network. Grow.</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-only">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/alumni" className={`nav-item ${isActive('/alumni') ? 'active' : ''}`}>
            Alumni
          </Link>
          <Link to="/jobs" className={`nav-item ${isActive('/jobs') ? 'active' : ''}`}>
            Jobs
          </Link>
          <Link to="/events" className={`nav-item ${isActive('/events') ? 'active' : ''}`}>
            Events
          </Link>
          <Link to="/contact" className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
        </div>

        {/* Auth Buttons / User Profile */}
        <div className="nav-actions desktop-only">
          {isAuthenticated ? (
            <div className="user-menu">
              {user?.role === 'admin' && (
                <Link to="/admin" className={`btn btn-accent icon-btn ${isActive('/admin') ? 'active' : ''}`}>
                  <ShieldCheck size={16} />
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link to="/messages" className={`btn btn-outline icon-btn ${isActive('/messages') ? 'active' : ''}`}>
                <MessageSquare size={16} />
                <span>Messages</span>
              </Link>
              <Link to="/dashboard" className={`btn btn-secondary ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/profile" className="user-profile-link" title="My Profile">
                <img
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="user-avatar"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'; }}
                />
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm icon-btn" title="Logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <Home size={18} /> Home
          </Link>
          <Link to="/about" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <Info size={18} /> About
          </Link>
          <Link to="/alumni" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <Users size={18} /> Alumni Directory
          </Link>
          <Link to="/jobs" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <Briefcase size={18} /> Jobs
          </Link>
          <Link to="/events" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <Calendar size={18} /> Events
          </Link>
          <Link to="/contact" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
            <Mail size={18} /> Contact
          </Link>

          {isAuthenticated ? (
            <>
              <div className="mobile-divider" />
              {user?.role === 'admin' && (
                <Link to="/admin" className="mobile-item highlight" onClick={() => setMobileMenuOpen(false)}>
                  <ShieldCheck size={18} /> Admin Control Center
                </Link>
              )}
              <Link to="/messages" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
                <MessageSquare size={18} /> Messages
              </Link>
              <Link to="/dashboard" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/profile" className="mobile-item" onClick={() => setMobileMenuOpen(false)}>
                <User size={18} /> My Profile ({user?.name})
              </Link>
              <button onClick={handleLogout} className="mobile-item logout-btn">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <div className="mobile-divider" />
              <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-full mt-2" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
