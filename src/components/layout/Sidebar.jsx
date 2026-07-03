import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, FolderOpen, PlusCircle, ImageIcon,
  Settings, ChevronLeft, ChevronRight, Zap, ExternalLink, X
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/projects/new', label: 'Add Project', icon: PlusCircle },
  { to: '/media', label: 'Media Library', icon: ImageIcon },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose, isMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const settings = JSON.parse(localStorage.getItem('teqno_settings') || '{}');
  const portfolioUrl = settings.portfolioUrl || import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:3000';

  // On mobile, sidebar is always expanded (not collapsed) and acts as a drawer
  const isCollapsed = isMobile ? false : collapsed;
  const sidebarWidth = isCollapsed ? '72px' : '240px';

  return (
    <aside
      className={`sidebar-desktop ${open ? 'open' : ''}`}
      style={{
        width: sidebarWidth,
        minHeight: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: isMobile
          ? 'transform 0.35s cubic-bezier(0.16,1,0.3,1)'
          : 'width 0.35s cubic-bezier(0.16,1,0.3,1)',
        position: 'fixed',
        top: 0, left: 0,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: isCollapsed ? '24px 16px' : '24px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 72,
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 20px rgba(139,92,246,0.4)',
          }}>
            <Zap size={18} color="#fff" />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.01em' }}>
                Teqnocapital
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                Admin Panel
              </div>
            </div>
          )}
        </div>
        {/* Close button on mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(139,92,246,0.08)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname.startsWith(to) && !(to === '/' && location.pathname !== '/');
          return (
            <NavLink
              key={to}
              to={to}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '10px' : '10px 14px' }}
              title={isCollapsed ? label : undefined}
              onClick={() => { if (isMobile) onClose(); }}
            >
              <Icon size={18} style={{ flexShrink: 0, color: isActive ? 'var(--purple)' : 'currentColor' }} />
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        {!isCollapsed && (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="sidebar-link"
            style={{ marginBottom: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}
          >
            <ExternalLink size={16} />
            <span>View Portfolio</span>
          </a>
        )}
        {/* Only show collapse toggle on desktop */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            className="sidebar-link"
            style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
          </button>
        )}
      </div>
    </aside>
  );
}
