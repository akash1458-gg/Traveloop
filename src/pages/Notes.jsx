import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import db from '../utils/database';
import { getRelativeTime } from '../utils/helpers';
import { Plus, Trash2, Edit, Save, X, FileText, StickyNote } from 'lucide-react';
import './Notes.css';

export default function Notes() {
  const { user } = useAuth();
  const toast = useToast();
  const [selectedTrip, setSelectedTrip] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [showAdd, setShowAdd] = useState(false);
  const trips = db.query('trips', t => t.user_id === user?.id);

  useEffect(() => {
    if (selectedTrip) loadNotes();
  }, [selectedTrip]);

  const loadNotes = () => {
    setNotes(db.query('notes', n => n.trip_id === selectedTrip).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title required'); return; }
    if (editingId) {
      db.update('notes', editingId, { title: form.title, content: form.content });
      toast.success('Note updated');
    } else {
      db.insert('notes', { trip_id: selectedTrip, stop_id: null, title: form.title, content: form.content });
      toast.success('Note added');
    }
    setForm({ title: '', content: '' });
    setEditingId(null);
    setShowAdd(false);
    loadNotes();
  };

  const startEdit = (note) => { setEditingId(note.id); setForm({ title: note.title, content: note.content }); setShowAdd(true); };
  const deleteNote = (id) => { db.delete('notes', id); loadNotes(); toast.success('Note deleted'); };
  const cancelEdit = () => { setEditingId(null); setForm({ title: '', content: '' }); setShowAdd(false); };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Travel Notes</h1>
        <div className="flex gap-3">
          <select className="form-input" style={{ width: 'auto', minWidth: 220 }} value={selectedTrip}
            onChange={e => setSelectedTrip(e.target.value)} id="notes-trip-select">
            <option value="">Select a trip</option>
            {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {selectedTrip && <button className="btn btn-primary" onClick={() => { setShowAdd(true); setEditingId(null); setForm({ title: '', content: '' }); }}>
            <Plus size={16} /> New Note
          </button>}
        </div>
      </div>

      {!selectedTrip ? (
        <div className="empty-state card"><StickyNote size={48} /><h3 className="heading-4">Select a trip</h3></div>
      ) : (
        <div className="notes-layout animate-fadeInUp">
          {showAdd && (
            <form onSubmit={handleSave} className="card note-form animate-scaleIn" id="note-form">
              <h3 className="heading-4">{editingId ? 'Edit Note' : 'New Note'}</h3>
              <input className="form-input" placeholder="Note title" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} id="note-title-input" />
              <textarea className="form-input form-textarea" placeholder="Write your note..." value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={5} id="note-content-input" />
              <div className="flex gap-3" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="save-note-btn"><Save size={16} /> Save</button>
              </div>
            </form>
          )}

          {notes.length === 0 && !showAdd && (
            <div className="empty-state card"><FileText size={48} /><h3 className="heading-4">No notes yet</h3></div>
          )}

          <div className="notes-grid">
            {notes.map(note => (
              <div key={note.id} className="note-card card" id={`note-${note.id}`}>
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => startEdit(note)}><Edit size={14} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteNote(note.id)} style={{ color: 'var(--color-danger-light)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="note-content">{note.content}</p>
                <span className="note-time">{getRelativeTime(note.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
