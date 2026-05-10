import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Map, PlusCircle, Search, DollarSign, CheckSquare,
  FileText, Share2, User, LogOut, Compass, BarChart3, ChevronLeft, ChevronRight,
  Sparkles, CalendarDays, Palette, Leaf
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/create-trip', icon: PlusCircle, label: 'New Trip' },
  { type: 'divider' },
  { to: '/cities', icon: Compass, label: 'Explore Cities' },
  { to: '/activities', icon: Search, label: 'Activities' },
  { to: '/experiences', icon: Sparkles, label: 'Experiences' },
  { to: '/festivals', icon: CalendarDays, label: 'Festivals' },
  { to: '/colours', icon: Palette, label: 'Colours of India' },
  { to: '/travel-for-life', icon: Leaf, label: 'Travel for LiFE' },
  { type: 'divider' },
  { to: '/budget', icon: DollarSign, label: 'Budget' },
  { to: '/packing', icon: CheckSquare, label: 'Packing List' },
  { to: '/notes', icon: FileText, label: 'Travel Notes' },
  { type: 'divider' },
  { to: '/profile', icon: User, label: 'Profile' },
];


export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="main-sidebar">
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
            <span className="logo-icon">✈️</span>
            <span className="logo-text">Traveloop</span>
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          id="sidebar-toggle-btn"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.type === 'divider') return <div key={i} className="sidebar-divider" />;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              id={`nav-${item.to.replace('/', '')}`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user.name}</span>
              <span className="sidebar-user-email">{user.email}</span>
            </div>
          </div>
        )}
        <button className="sidebar-link logout-btn" onClick={handleLogout} id="logout-btn">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
