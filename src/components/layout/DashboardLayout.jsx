import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <Header />
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
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
