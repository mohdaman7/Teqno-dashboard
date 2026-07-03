import { useLocation } from 'react-router-dom';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useState } from 'react';

const routeTitles = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/projects/new': 'Add New Project',
  '/media': 'Media Library',
  '/settings': 'Settings',
};

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const [query, setQuery] = useState('');

  const title = Object.entries(routeTitles)
    .reverse()
    .find(([path]) => location.pathname.startsWith(path))?.[1] || 'Dashboard';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="header-bar" style={{
      height: 72,
      background: 'rgba(2,2,10,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Mobile hamburger */}
      <button className="mobile-menu-btn" onClick={onMenuToggle}>
        <Menu size={18} />
      </button>

      {/* Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {dateStr}
        </p>
      </div>

      {/* Search – hidden on mobile via CSS class */}
      <div className="header-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={15} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input
          className="form-input"
          style={{ paddingLeft: 36, width: 220, height: 38, fontSize: '0.825rem' }}
          placeholder="Search projects…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Notifications */}
      <button style={{
        width: 38, height: 38,
        borderRadius: '10px',
        background: 'rgba(139,92,246,0.08)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-secondary)',
        transition: 'all 0.2s',
        position: 'relative',
        flexShrink: 0,
      }}>
        <Bell size={16} />
        <span style={{
          position: 'absolute', top: 6, right: 7,
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--purple)',
          boxShadow: '0 0 8px rgba(168,85,247,0.8)',
        }} />
      </button>

      {/* Avatar */}
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))',
        border: '1px solid rgba(139,92,246,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}>
        <User size={17} color="var(--purple)" />
      </div>
    </header>
  );
}
