import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Users, Briefcase, Calendar, GraduationCap, Award, Globe, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [jobsRes, eventsRes] = await Promise.all([
          API.get('/jobs'),
          API.get('/events')
        ]);
        setLatestJobs(jobsRes.data.slice(0, 3));
        setUpcomingEvents(eventsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">Official Alumni Network</div>
          <h1 className="hero-title">
            Connect. Network. <span className="highlight-text">Grow.</span>
          </h1>
          <p className="hero-description">
            Connect with alumni, discover career opportunities, participate in events and grow your professional network.
          </p>
          <div className="hero-buttons">
            <Link to="/alumni" className="btn btn-primary btn-lg">
              Explore Alumni <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* About AlumniConnect Section */}
      <section className="section section-light">
        <div className="section-container">
          <div className="grid-2">
            <div className="about-text">
              <span className="section-tag">About Us</span>
              <h2>Bridging the Gap Between Alumni & Students</h2>
              <p>
                AlumniConnect serves as the central platform for graduates to stay connected with their alma mater.
                Whether you are looking for career mentorship, seeking top talent for your organization, or staying updated on campus events, AlumniConnect is your gateway.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <CheckCircle className="text-accent" size={20} />
                  <span>Verified alumni profiles across all engineering & business departments</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="text-accent" size={20} />
                  <span>Direct job postings & career opportunities from distinguished alumni</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="text-accent" size={20} />
                  <span>Exclusive webinars, homecoming galas, and networking meetups</span>
                </div>
              </div>
            </div>
            <div className="about-stats-card">
              <div className="stat-box">
                <Users className="stat-icon" size={32} />
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Active Alumni</span>
              </div>
              <div className="stat-box">
                <Briefcase className="stat-icon" size={32} />
                <span className="stat-number">1,200+</span>
                <span className="stat-label">Jobs Posted</span>
              </div>
              <div className="stat-box">
                <Calendar className="stat-icon" size={32} />
                <span className="stat-number">350+</span>
                <span className="stat-label">Events Hosted</span>
              </div>
              <div className="stat-box">
                <Globe className="stat-icon" size={32} />
                <span className="stat-number">40+</span>
                <span className="stat-label">Countries Reached</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="section section-dark">
        <div className="section-container text-center">
          <span className="section-tag">Why Join?</span>
          <h2 className="section-title">Empowering Alumni Throughout Their Careers</h2>
          <div className="cards-grid-3">
            <div className="card feature-card">
              <div className="card-icon-wrapper">
                <Users size={28} />
              </div>
              <h3>Expand Your Network</h3>
              <p>Connect with industry leaders, batchmates, and mentors working at top global firms.</p>
            </div>
            <div className="card feature-card">
              <div className="card-icon-wrapper">
                <Briefcase size={28} />
              </div>
              <h3>Career Advancement</h3>
              <p>Explore exclusive job openings shared directly by alumni recruiters and hiring leads.</p>
            </div>
            <div className="card feature-card">
              <div className="card-icon-wrapper">
                <Award size={28} />
              </div>
              <h3>Knowledge Sharing</h3>
              <p>Participate in technical workshops, webinars, and panel discussions to stay ahead.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="section section-light">
        <div className="section-container">
          <div className="section-header-flex">
            <div>
              <span className="section-tag">Career Portal</span>
              <h2>Latest Job Opportunities</h2>
            </div>
            <Link to="/jobs" className="link-btn">
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : latestJobs.length > 0 ? (
            <div className="cards-grid-3">
              {latestJobs.map((job) => (
                <div key={job._id} className="card job-card">
                  <div className="job-badge">{job.jobType}</div>
                  <h3>{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <p className="job-location">📍 {job.location}</p>
                  <p className="job-desc">{job.description.substring(0, 100)}...</p>
                  <div className="card-footer-flex">
                    <span className="posted-by">Posted by: {job.postedBy?.name || 'Alumnus'}</span>
                    <Link to="/jobs" className="btn btn-sm btn-outline">Details</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-msg">No jobs available at the moment.</p>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section section-dark">
        <div className="section-container">
          <div className="section-header-flex">
            <div>
              <span className="section-tag">Gatherings</span>
              <h2>Upcoming Alumni Events</h2>
            </div>
            <Link to="/events" className="link-btn">
              View All Events <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : upcomingEvents.length > 0 ? (
            <div className="cards-grid-3">
              {upcomingEvents.map((evt) => (
                <div key={evt._id} className="card event-card">
                  <div className="event-date-badge">📅 {evt.date} • {evt.time}</div>
                  <h3>{evt.title}</h3>
                  <p className="event-location">📍 {evt.location}</p>
                  <p className="event-desc">{evt.description.substring(0, 110)}...</p>
                  <div className="card-footer-flex">
                    <span className="posted-by">Organizer: {evt.createdBy?.name || 'Alumni Office'}</span>
                    <Link to="/events" className="btn btn-sm btn-primary">RSVP / Details</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-msg">No upcoming events scheduled.</p>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Connect with Your Community?</h2>
          <p>Join thousands of alumni building meaningful professional relationships today.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Your Free Account
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Contact Alumni Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
