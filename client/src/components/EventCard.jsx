import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Trash2, Edit } from 'lucide-react';

const EventCard = ({ event, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isOwner = user && event.createdBy && (event.createdBy._id === user._id || event.createdBy === user._id);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>{event.title}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} />
            <span>{event.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} />
            <span>{event.time}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        <MapPin size={15} />
        <span>{event.location}</span>
      </div>

      <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.25rem', flex: 1, whiteSpace: 'pre-line' }}>
        {event.description}
      </p>

      {event.createdBy && typeof event.createdBy === 'object' && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
          Organized by {event.createdBy.name} ({event.createdBy.department || 'Alumnus'})
        </div>
      )}

      {isOwner && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          {onEdit && (
            <button onClick={() => onEdit(event)} className="btn btn-secondary btn-sm" title="Edit Event">
              <Edit size={14} /> Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(event._id)} className="btn btn-danger btn-sm" title="Delete Event">
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
