import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, GraduationCap, ArrowRight } from 'lucide-react';

const AlumniCard = ({ alumnus }) => {
  const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(alumnus.name)}`;

  return (
    <div className="card alumnus-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <img
          src={alumnus.profileImage || fallbackAvatar}
          alt={alumnus.name}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--primary-light)',
            backgroundColor: '#f1f5f9'
          }}
          onError={(e) => { e.target.src = fallbackAvatar; }}
        />
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)' }}>{alumnus.name}</h3>
          <span className="badge" style={{ marginTop: '0.2rem' }}>
            Class of {alumnus.graduationYear}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <GraduationCap size={16} color="var(--primary)" />
          <span>{alumnus.department}</span>
        </div>

        {alumnus.company && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Building2 size={16} color="var(--secondary)" />
            <span>
              {alumnus.jobTitle ? `${alumnus.jobTitle} at ` : ''}
              <strong>{alumnus.company}</strong>
            </span>
          </div>
        )}

        {alumnus.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <MapPin size={16} color="#64748b" />
            <span>{alumnus.location}</span>
          </div>
        )}
      </div>

      <Link
        to={`/alumni/${alumnus._id}`}
        className="btn btn-secondary btn-sm btn-full"
        style={{ marginTop: 'auto' }}
      >
        View Profile <ArrowRight size={15} />
      </Link>
    </div>
  );
};

export default AlumniCard;
