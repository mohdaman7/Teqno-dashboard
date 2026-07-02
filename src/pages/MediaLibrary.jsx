import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, Film, Trash2, Copy, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const resolveAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
  return `http://localhost:3000${url}`;
};

export default function MediaLibrary() {
  const { addToast } = useToast();
  const [activeType, setActiveType] = useState('all');
  const [copied, setCopied] = useState(null);

  // Seed with known project images/videos
  const [mediaItems] = useState([
    { id: 1, name: 'ai-saas.png',                  type: 'image', url: '/projects/ai-saas.png',                          size: '617 KB' },
    { id: 2, name: 'real-estate.png',               type: 'image', url: '/projects/real-estate.png',                     size: '654 KB' },
    { id: 3, name: 'luxury-interior.png',           type: 'image', url: '/projects/luxury-interior.png',                 size: '626 KB' },
    { id: 4, name: 'ecommerce.png',                 type: 'image', url: '/projects/ecommerce.png',                       size: '526 KB' },
    { id: 5, name: 'branding.png',                  type: 'image', url: '/projects/branding.png',                        size: '711 KB' },
    { id: 6, name: 'automation-dashboard.png',      type: 'image', url: '/projects/automation-dashboard.png',            size: '737 KB' },
    { id: 7, name: 'ai-saas-preview.mp4',           type: 'video', url: '/projects/videos/ai-saas-preview.mp4',         size: 'N/A' },
    { id: 8, name: 'real-estate-preview.mp4',       type: 'video', url: '/projects/videos/real-estate-preview.mp4',     size: 'N/A' },
    { id: 9, name: 'luxury-interior-preview.mp4',   type: 'video', url: '/projects/videos/luxury-interior-preview.mp4', size: 'N/A' },
    { id: 10, name: 'ecommerce-preview.mp4',        type: 'video', url: '/projects/videos/ecommerce-preview.mp4',       size: 'N/A' },
    { id: 11, name: 'branding-preview.mp4',         type: 'video', url: '/projects/videos/branding-preview.mp4',        size: 'N/A' },
    { id: 12, name: 'automation-dashboard-preview.mp4', type: 'video', url: '/projects/videos/automation-dashboard-preview.mp4', size: 'N/A' },
  ]);

  const filtered = activeType === 'all' ? mediaItems : mediaItems.filter(m => m.type === activeType);

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(resolveAssetUrl(url));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    addToast('URL copied to clipboard!', 'success');
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Media Library</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 3 }}>{mediaItems.length} files total</p>
        </div>
        <button className="btn-primary">
          <Upload size={16} /> Upload Files
        </button>
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {[['all', 'All Files'], ['image', 'Images'], ['video', 'Videos']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setActiveType(val)}
            style={{
              padding: '7px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', fontWeight: 600,
              border: '1px solid var(--border)', cursor: 'pointer',
              background: activeType === val ? 'rgba(139,92,246,0.2)' : 'rgba(7,7,26,0.5)',
              color: activeType === val ? 'var(--purple)' : 'var(--text-secondary)',
              borderColor: activeType === val ? 'rgba(139,92,246,0.4)' : 'var(--border)',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Upload drop zone */}
      <div
        className="dropzone"
        style={{ marginBottom: 24 }}
        onClick={() => addToast('Upload functionality — connect to your file storage backend', 'info')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={20} color="var(--purple)" />
          </div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--purple)' }}>Click to upload</span> or drag & drop
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PNG, JPG, WebP, MP4, WebM — max 500MB</p>
        </div>
      </div>

      {/* Media Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.03 }}
              className="glass-sm glow-border"
              style={{ overflow: 'hidden', cursor: 'pointer' }}
            >
              {/* Preview */}
              <div style={{ height: 140, background: 'rgba(7,7,26,0.5)', position: 'relative', overflow: 'hidden' }}>
                {item.type === 'image' ? (
                  <img
                    src={resolveAssetUrl(item.url)}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.08)' }}>
                    <Film size={32} color="rgba(168,85,247,0.5)" />
                  </div>
                )}
                {/* Type badge */}
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700,
                  background: item.type === 'video' ? 'rgba(168,85,247,0.8)' : 'rgba(6,182,212,0.8)',
                  color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  {item.type === 'video' ? 'VID' : 'IMG'}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                  {item.name}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.size}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button
                    onClick={() => copyUrl(item.url, item.id)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      padding: '5px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600,
                      background: copied === item.id ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.1)',
                      border: copied === item.id ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(139,92,246,0.2)',
                      color: copied === item.id ? '#34d399' : 'var(--purple)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {copied === item.id ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy URL</>}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
