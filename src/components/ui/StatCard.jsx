import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, sub, color = 'var(--purple)', trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass glow-border shimmer"
      style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle corner gradient */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 100, height: 100,
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
            {label}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>{sub}</p>
          )}
          {trend !== undefined && (
            <p style={{
              fontSize: '0.75rem', marginTop: 6, fontWeight: 600,
              color: trend >= 0 ? 'var(--emerald)' : 'var(--red)',
            }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </motion.div>
  );
}
