/* Traveloop Database Layer — localStorage with relational structure */
import { v4 as uuidv4 } from 'uuid';

const DB_PREFIX = 'traveloop_';

const getTable = (name) => {
  try {
    return JSON.parse(localStorage.getItem(DB_PREFIX + name)) || [];
  } catch { return []; }
};

const setTable = (name, data) => {
  localStorage.setItem(DB_PREFIX + name, JSON.stringify(data));
};

// Generic CRUD
const db = {
  getAll: (table) => getTable(table),

  getById: (table, id) => getTable(table).find(r => r.id === id),

  query: (table, predicate) => getTable(table).filter(predicate),

  insert: (table, record) => {
    const rows = getTable(table);
    const newRecord = { ...record, id: record.id || uuidv4(), created_at: new Date().toISOString() };
    rows.push(newRecord);
    setTable(table, rows);
    return newRecord;
  },

  update: (table, id, updates) => {
    const rows = getTable(table);
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...updates, updated_at: new Date().toISOString() };
    setTable(table, rows);
    return rows[idx];
  },

  delete: (table, id) => {
    const rows = getTable(table);
    setTable(table, rows.filter(r => r.id !== id));
    return true;
  },

  deleteWhere: (table, predicate) => {
    const rows = getTable(table);
    setTable(table, rows.filter(r => !predicate(r)));
  },

  count: (table, predicate) => {
    const rows = getTable(table);
    return predicate ? rows.filter(predicate).length : rows.length;
  },

  clear: (table) => setTable(table, []),

  isSeeded: () => localStorage.getItem(DB_PREFIX + 'seeded') === 'v4_indian_states',
  markSeeded: () => localStorage.setItem(DB_PREFIX + 'seeded', 'v4_indian_states'),

  clearAll: () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(DB_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  },
};

export default db;
