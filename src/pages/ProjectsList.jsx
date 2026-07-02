import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { useToast } from '../context/ToastContext';
import { PlusCircle, Search, Edit3, Trash2, Eye, Globe, EyeOff, MoreVertical, Film } from 'lucide-react';

const resolveAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
  return `http://localhost:3000${url}`;
};

export default function ProjectsList() {
  const { projects, deleteProject, publishProject, draftProject } = useProjects();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id) => {
    deleteProject(id);
    addToast('Project deleted successfully', 'success');
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (p) => {
    if (p.status === 'published') {
      draftProject(p.id);
      addToast(`"${p.title}" moved to draft`, 'info');
    } else {
      publishProject(p.id);
      addToast(`"${p.title}" published!`, 'success');
    }
    setOpenMenu(null);
  };

  return (
    <div className="page-enter">
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>All Projects</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 3 }}>{projects.length} projects total</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/projects/new')}>
          <PlusCircle size={16} /> New Project
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 34 }}
            placeholder="Search by title or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {['all', 'published', 'draft'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem', fontWeight: 600,
              border: '1px solid var(--border)',
              background: filter === f ? 'rgba(139,92,246,0.2)' : 'rgba(7,7,26,0.5)',
              color: filter === f ? 'var(--purple)' : 'var(--text-secondary)',
              borderColor: filter === f ? 'rgba(139,92,246,0.4)' : 'var(--border)',
              textTransform: 'capitalize', transition: 'all 0.2s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div className="glass" style={{ overflow: 'hidden' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Media</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {/* Thumbnail + Title */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 36, borderRadius: 8, overflow: 'hidden', background: 'rgba(139,92,246,0.12)', flexShrink: 0 }}>
                        {p.image && (
                          <img
                            src={resolveAssetUrl(p.image)}
                            alt={p.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => e.target.style.display='none'}
                          />
                        )}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{p.title}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{p.category}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 220 }}>
                      {p.tags?.slice(0, 2).map(t => (
                        <span key={t} className="tag-chip" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{t}</span>
                      ))}
                      {p.tags?.length > 2 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{p.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.image && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.25)', fontWeight: 600 }}>IMG</span>}
                      {p.video && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><Film size={10} />VID</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${p.status === 'published' ? 'badge-green' : 'badge-amber'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{p.createdAt}</td>
                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                      <button className="btn-secondary" style={{ padding: '6px 10px' }} onClick={() => navigate(`/projects/${p.id}/edit`)}>
                        <Edit3 size={13} />
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 10px', position: 'relative' }}
                        onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      >
                        <MoreVertical size={13} />
                      </button>
                      <AnimatePresence>
                        {openMenu === p.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: -4 }}
                            style={{
                              position: 'absolute', top: '110%', right: 0,
                              background: 'rgba(7,7,26,0.97)', border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)', padding: '6px',
                              zIndex: 100, minWidth: 160,
                              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            }}
                          >
                            <button className="sidebar-link" style={{ width: '100%', fontSize: '0.825rem', padding: '8px 12px' }} onClick={() => handleToggleStatus(p)}>
                              {p.status === 'published' ? <><EyeOff size={14} /> Move to Draft</> : <><Globe size={14} /> Publish</>}
                            </button>
                            <button className="sidebar-link" style={{ width: '100%', fontSize: '0.825rem', padding: '8px 12px', color: '#f87171' }} onClick={() => { setDeleteConfirm(p); setOpenMenu(null); }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.875rem' }}>No projects found matching your filters.</p>
          </div>
        )}
      </motion.div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass"
              style={{ padding: 32, maxWidth: 400, width: '90%' }}
              onClick={e => e.stopPropagation()}
            >
              <Trash2 size={28} color="#f87171" style={{ marginBottom: 14 }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#fff', marginBottom: 8 }}>Delete Project?</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                "{deleteConfirm.title}" will be permanently removed. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleDelete(deleteConfirm.id)}>
                  <Trash2 size={14} /> Delete
                </button>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
