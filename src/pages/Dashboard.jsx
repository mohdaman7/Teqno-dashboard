import { motion } from 'framer-motion';
import { useProjects } from '../context/ProjectsContext';
import StatCard from '../components/ui/StatCard';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, Globe, Film, TrendingUp,
  PlusCircle, Eye, Edit3, ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const activityData = [
  { month: 'Jan', views: 1200 }, { month: 'Feb', views: 1900 },
  { month: 'Mar', views: 1400 }, { month: 'Apr', views: 2800 },
  { month: 'May', views: 2200 }, { month: 'Jun', views: 3600 },
  { month: 'Jul', views: 3100 }, { month: 'Aug', views: 4200 },
];

const resolveAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const portfolioBase = import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:3000';
  if (url.startsWith('/uploads')) return `${apiBase}${url}`;
  return `${portfolioBase}${url}`;
};

export default function Dashboard() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const published = projects.filter(p => p.status === 'published');
  const withVideo = projects.filter(p => p.video);
  const recent = [...projects].slice(0, 4);

  const settings = JSON.parse(localStorage.getItem('teqno_settings') || '{}');
  const portfolioUrl = settings.portfolioUrl || import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:3000';

  return (
    <div className="page-enter">
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}
        >
          Welcome back 👋
        </motion.h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage your portfolio, upload media and track your showcase performance.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 32 }}>
        <StatCard icon={FolderOpen} label="Total Projects"  value={projects.length}  color="var(--purple)" trend={12} delay={0} />
        <StatCard icon={Globe}     label="Published"        value={published.length} color="var(--emerald)" trend={8}  delay={0.05} />
        <StatCard icon={Film}      label="With Videos"      value={withVideo.length} color="var(--cyan)"    trend={25} delay={0.1} />
        <StatCard icon={TrendingUp} label="Portfolio Views" value="4.2K"             sub="This month"       color="var(--pink)" trend={18} delay={0.15} />
      </div>

      {/* Chart + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18, alignItems: 'start' }}>

        {/* Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass"
          style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                Portfolio Views
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Monthly overview</p>
            </div>
            <span className="badge badge-purple">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.07)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(7,7,26,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10 }}
                labelStyle={{ color: '#fff', fontWeight: 600 }}
                itemStyle={{ color: '#c084fc' }}
              />
              <Area type="monotone" dataKey="views" stroke="#a855f7" strokeWidth={2.5} fill="url(#viewsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass"
          style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
              Recent Projects
            </h3>
            <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }} onClick={() => navigate('/projects')}>
              View all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(7,7,26,0.4)', border: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onClick={() => navigate(`/projects/${p.id}/edit`)}
                whileHover={{ borderColor: 'rgba(168,85,247,0.4)', background: 'rgba(139,92,246,0.06)' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 9, overflow: 'hidden', flexShrink: 0,
                  background: 'rgba(139,92,246,0.15)',
                }}>
                  {p.image && <img src={resolveAssetUrl(p.image)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.825rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.category}</p>
                </div>
                <span className={`badge ${p.status === 'published' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                  {p.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ marginTop: 24, display: 'flex', gap: 14 }}
      >
        <button className="btn-primary" onClick={() => navigate('/projects/new')}>
          <PlusCircle size={16} /> Add New Project
        </button>
        <button className="btn-secondary" onClick={() => navigate('/media')}>
          <Film size={16} /> Media Library
        </button>
        <a href={portfolioUrl} target="_blank" rel="noreferrer" className="btn-secondary">
          <Eye size={16} /> Preview Portfolio
          <ArrowUpRight size={13} />
        </a>
      </motion.div>
    </div>
  );
}
