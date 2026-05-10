import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import db from '../utils/database';
import { CheckSquare, Plus, Trash2, RotateCcw, Package } from 'lucide-react';
import './Packing.css';

const CATEGORIES = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Health', 'Accessories', 'Other'];

export default function Packing() {
  const { user } = useAuth();
  const toast = useToast();
  const [selectedTrip, setSelectedTrip] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState('Other');
  const trips = db.query('trips', t => t.user_id === user?.id);

  useEffect(() => {
    if (selectedTrip) loadItems();
  }, [selectedTrip]);

  const loadItems = () => setItems(db.query('packing_items', p => p.trip_id === selectedTrip));

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim() || !selectedTrip) return;
    db.insert('packing_items', { trip_id: selectedTrip, name: newItem.trim(), category: newCat, is_packed: false });
    setNewItem('');
    loadItems();
    toast.success('Item added');
  };

  const togglePacked = (id, current) => {
    db.update('packing_items', id, { is_packed: !current });
    loadItems();
  };

  const deleteItem = (id) => { db.delete('packing_items', id); loadItems(); };

  const resetAll = () => {
    items.forEach(i => db.update('packing_items', i.id, { is_packed: false }));
    loadItems();
    toast.success('Checklist reset');
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  const packedCount = items.filter(i => i.is_packed).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Packing Checklist</h1>
        <select className="form-input" style={{ width: 'auto', minWidth: 220 }} value={selectedTrip}
          onChange={e => setSelectedTrip(e.target.value)} id="packing-trip-select">
          <option value="">Select a trip</option>
          {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {!selectedTrip ? (
        <div className="empty-state card"><Package size={48} /><h3 className="heading-4">Select a trip</h3></div>
      ) : (
        <div className="packing-layout animate-fadeInUp">
          {/* Progress */}
          <div className="card packing-progress">
            <div className="flex justify-between items-center">
              <span>{packedCount} of {items.length} packed</span>
              <button className="btn btn-ghost btn-sm" onClick={resetAll}><RotateCcw size={14} /> Reset</button>
            </div>
            <div className="progress-bar" style={{ marginTop: 'var(--space-2)' }}>
              <div className="progress-bar-fill" style={{ width: `${items.length ? (packedCount / items.length) * 100 : 0}%` }} />
            </div>
          </div>

          {/* Add Item */}
          <form onSubmit={addItem} className="card packing-add-form" id="add-packing-item-form">
            <input className="form-input" placeholder="Add item..." value={newItem} onChange={e => setNewItem(e.target.value)}
              id="packing-item-input" />
            <select className="form-input" style={{ width: 'auto' }} value={newCat} onChange={e => setNewCat(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" className="btn btn-primary btn-sm" id="add-packing-btn"><Plus size={16} /> Add</button>
          </form>

          {/* Items by Category */}
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="packing-category">
              <h3 className="packing-category-title">{cat} <span className="badge badge-primary">{catItems.length}</span></h3>
              {catItems.map(item => (
                <div key={item.id} className={`packing-item ${item.is_packed ? 'packed' : ''}`} id={`packing-${item.id}`}>
                  <button className="packing-check" onClick={() => togglePacked(item.id, item.is_packed)}>
                    <CheckSquare size={18} />
                  </button>
                  <span className="packing-item-name">{item.name}</span>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteItem(item.id)}
                    style={{ color: 'var(--color-danger-light)', opacity: 0.5 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
