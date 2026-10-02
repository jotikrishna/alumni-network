import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Building2, MapPin, Briefcase, ExternalLink, Trash2, Edit } from 'lucide-react';

const JobCard = ({ job, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isOwner = user && job.postedBy && (job.postedBy._id === user._id || job.postedBy === user._id);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>{job.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem' }}>
            <Building2 size={16} />
            <span>{job.company}</span>
          </div>
        </div>
        <span className="badge badge-gold" style={{ whiteSpace: 'nowrap' }}>
          {job.jobType}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={15} />
          <span>{job.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Briefcase size={15} />
          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.25rem', flex: 1, whiteSpace: 'pre-line' }}>
        {job.description}
      </p>

      {job.postedBy && typeof job.postedBy === 'object' && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
          Posted by {job.postedBy.name} ({job.postedBy.company || 'Alumnus'})
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
        {job.applicationUrl ? (
          <a
            href={job.applicationUrl.startsWith('http') ? job.applicationUrl : `https://${job.applicationUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Apply Now <ExternalLink size={14} />
          </a>
        ) : (
          <button className="btn btn-secondary btn-sm" disabled>
            Contact Poster
          </button>
        )}

        {isOwner && (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {onEdit && (
              <button onClick={() => onEdit(job)} className="btn btn-secondary btn-sm" title="Edit Job">
                <Edit size={14} />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(job._id)} className="btn btn-danger btn-sm" title="Delete Job">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
