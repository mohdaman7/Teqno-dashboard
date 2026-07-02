import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { Save, Globe, Mail, Github, Linkedin, Twitter, Download, Upload } from 'lucide-react';

const defaultSettings = {
  siteTitle: 'Teqnocapital',
  tagline: 'Premium Digital Experiences',
  email: 'hello@teqnocapital.com',
  github: 'https://github.com/teqnocapital',
  linkedin: 'https://linkedin.com/company/teqnocapital',
  twitter: 'https://twitter.com/teqnocapital',
  accent: '#a855f7',
  portfolioUrl: 'http://localhost:3000',
};

export default function Settings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('teqno_settings')) || defaultSettings; }
    catch { return defaultSettings; }
  });

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    localStorage.setItem('teqno_settings', JSON.stringify(settings));
    addToast('Settings saved successfully!', 'success');
  };

  const handleExport = () => {
    const data = {
      settings,
      projects: JSON.parse(localStorage.getItem('teqno_projects') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'teqnocapital-backup.json'; a.click();
    URL.revokeObjectURL(url);
    addToast('Data exported successfully!', 'success');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.settings) { localStorage.setItem('teqno_settings', JSON.stringify(data.settings)); setSettings(data.settings); }
        if (data.projects) { localStorage.setItem('teqno_projects', JSON.stringify(data.projects)); }
        addToast('Data imported! Refresh to see all changes.', 'success');
      } catch { addToast('Invalid backup file', 'error'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-enter" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Settings</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 3 }}>Manage site identity, social links, and data backup</p>
      </div>

      {/* Site Identity */}
      <motion.div className="glass" style={{ padding: 26, marginBottom: 18 }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={16} color="var(--purple)" /> Site Identity
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label className="form-label">Site Title</label><input className="form-input" value={settings.siteTitle} onChange={e => set('siteTitle', e.target.value)} /></div>
          <div><label className="form-label">Tagline</label><input className="form-input" value={settings.tagline} onChange={e => set('tagline', e.target.value)} /></div>
          <div><label className="form-label">Contact Email</label><input className="form-input" type="email" value={settings.email} onChange={e => set('email', e.target.value)} /></div>
          <div><label className="form-label">Portfolio URL</label><input className="form-input" value={settings.portfolioUrl} onChange={e => set('portfolioUrl', e.target.value)} /></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <label className="form-label">Accent Colour</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="color" value={settings.accent} onChange={e => set('accent', e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'none', cursor: 'pointer' }} />
            <input className="form-input" value={settings.accent} onChange={e => set('accent', e.target.value)} style={{ maxWidth: 140 }} />
            <div style={{ flex: 1, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${settings.accent}, #ec4899)`, border: '1px solid var(--border)' }} />
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div className="glass" style={{ padding: 26, marginBottom: 18 }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={16} color="var(--cyan)" /> Social Links
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'github',   label: 'GitHub',   icon: Github,   placeholder: 'https://github.com/…' },
            { key: 'linkedin', label: 'LinkedIn',  icon: Linkedin, placeholder: 'https://linkedin.com/…' },
            { key: 'twitter',  label: 'Twitter/X', icon: Twitter,  placeholder: 'https://twitter.com/…' },
          ].map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key} style={{ position: 'relative' }}>
              <label className="form-label">{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input className="form-input" style={{ paddingLeft: 34 }} value={settings[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div className="glass" style={{ padding: 26, marginBottom: 28 }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={16} color="var(--amber)" /> Data Management
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 18 }}>Export all projects and settings as a JSON backup, or import a previous backup.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" onClick={handleExport}><Download size={15} /> Export Backup</button>
          <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Upload size={15} /> Import Backup
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
        </div>
      </motion.div>

      {/* Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleSave}><Save size={15} /> Save Settings</button>
      </div>
    </div>
  );
}
