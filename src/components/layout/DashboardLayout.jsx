import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

      <div
        className="main-content-area"
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : 240,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <Header onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="main-area-inner" style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {/* Subtle ambient glow effects */}
          <div style={{ position: 'fixed', top: '15%', right: '-5%', width: 400, height: 400, background: 'rgba(139,92,246,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'fixed', bottom: '10%', left: '10%', width: 300, height: 300, background: 'rgba(236,72,153,0.03)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
