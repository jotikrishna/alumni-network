import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Target, Users, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="about-page section-container">
      {/* Header Banner */}
      <div className="page-header text-center">
        <span className="badge-pill">About AlumniConnect</span>
        <h1 className="page-title">Connecting Graduates, Empowering Futures</h1>
        <p className="page-subtitle">
          AlumniConnect is the official alumni networking platform dedicated to fostering meaningful relationships, professional growth, and lifelong community support.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid-2 my-8">
        <div className="card shadow-card">
          <div className="card-icon-wrapper">
            <Target size={32} />
          </div>
          <h2>Our Mission</h2>
          <p>
            To create a vibrant, collaborative ecosystem where alumni can network, share industry knowledge, mentor emerging graduates, and contribute to institutional excellence.
          </p>
        </div>

        <div className="card shadow-card">
          <div className="card-icon-wrapper">
            <GraduationCap size={32} />
          </div>
          <h2>Our Vision</h2>
          <p>
            To be the most engaged and supportive global university alumni network, empowering every graduate to achieve their career goals while staying tied to their alma mater.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="my-12">
        <div className="text-center mb-8">
          <span className="section-tag">Core Principles</span>
          <h2>What Drives Our Community</h2>
        </div>
        <div className="cards-grid-3">
          <div className="card text-center">
            <Users className="mx-auto mb-4 text-accent" size={36} />
            <h3>Community First</h3>
            <p>Every member is valued. We cultivate a welcoming, inclusive space for alumni from all years and departments.</p>
          </div>
          <div className="card text-center">
            <HeartHandshake className="mx-auto mb-4 text-accent" size={36} />
            <h3>Mentorship & Support</h3>
            <p>Empowering students and recent graduates through direct peer guidance and professional insights.</p>
          </div>
          <div className="card text-center">
            <ShieldCheck className="mx-auto mb-4 text-accent" size={36} />
            <h3>Integrity & Excellence</h3>
            <p>Maintaining high standards of professional etiquette, privacy, and authentic representation.</p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="cta-banner-box">
        <h2>Become Part of AlumniConnect Today</h2>
        <p>Register your alumni profile to unlock full access to our directory, job portal, and events.</p>
        <Link to="/register" className="btn btn-primary btn-lg mt-4">
          Register Account
        </Link>
      </div>
    </div>
  );
};

export default About;
