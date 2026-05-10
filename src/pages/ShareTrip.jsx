import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import db from '../utils/database';
import { formatDate, formatCurrency, generateShareCode } from '../utils/helpers';
import { Share2, Copy, Globe, Lock, Link as LinkIcon, MapPin, Calendar } from 'lucide-react';
import './Share.css';

export default function ShareTrip() {
  const { tripId } = useParams();
  const toast = useToast();
  const [trip, setTrip] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const t = db.getById('trips', tripId);
    setTrip(t);
    const existing = db.query('shared_trips', s => s.trip_id === tripId);
    if (existing.length > 0) {
      setShareLink(existing[0].share_link);
      setIsPublic(existing[0].permission === 'public');
    }
  }, [tripId]);

  const generateLink = () => {
    const code = generateShareCode();
    const link = `${window.location.origin}/shared/${code}`;
    db.deleteWhere('shared_trips', s => s.trip_id === tripId);
    db.insert('shared_trips', { trip_id: tripId, share_link: link, permission: isPublic ? 'public' : 'private', shared_with: '' });
    setShareLink(link);
    toast.success('Share link generated!');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
  };

  if (!trip) return <div className="page-container"><div className="empty-state card"><h3>Trip not found</h3></div></div>;

  const stops = db.query('stops', s => s.trip_id === tripId);

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Share Trip</h1></div>

      <div className="share-layout animate-fadeInUp">
        <div className="card share-preview">
          <h3 className="heading-3">{trip.name}</h3>
          {trip.description && <p style={{ color: 'var(--color-text-secondary)' }}>{trip.description}</p>}
          <div className="flex gap-4" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
            <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(trip.start_date)} — {formatDate(trip.end_date)}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {stops.length} cities</span>
          </div>
        </div>

        <div className="card">
          <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Sharing Options</h3>
          <div className="share-toggle" onClick={() => setIsPublic(!isPublic)} id="share-toggle">
            <div className={`share-toggle-track ${isPublic ? 'active' : ''}`}>
              <div className="share-toggle-thumb" />
            </div>
            <div>
              <span style={{ fontWeight: 500 }}>{isPublic ? 'Public' : 'Private'}</span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                {isPublic ? 'Anyone with the link can view' : 'Only people you share with can view'}
              </p>
            </div>
            {isPublic ? <Globe size={20} style={{ color: 'var(--color-success)' }} /> : <Lock size={20} style={{ color: 'var(--color-text-muted)' }} />}
          </div>

          <button className="btn btn-primary" onClick={generateLink} style={{ marginTop: 'var(--space-4)', width: '100%' }} id="generate-link-btn">
            <LinkIcon size={16} /> {shareLink ? 'Regenerate Link' : 'Generate Share Link'}
          </button>

          {shareLink && (
            <div className="share-link-box" style={{ marginTop: 'var(--space-4)' }}>
              <input className="form-input" value={shareLink} readOnly id="share-link-input" />
              <button className="btn btn-secondary" onClick={copyLink} id="copy-link-btn"><Copy size={16} /> Copy</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
