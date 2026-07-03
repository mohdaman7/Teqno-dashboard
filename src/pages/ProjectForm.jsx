import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../context/ProjectsContext';
import { useToast } from '../context/ToastContext';
import MediaUploader from '../components/ui/MediaUploader';
import TagInput from '../components/ui/TagInput';
import { Save, ArrowLeft, Plus, Trash2, Globe, FileText } from 'lucide-react';

const CATEGORIES = [
  'AI & SaaS Development', 'Web Application', 'Branding & Web Design',
  'Scalable E-Commerce', 'Brand Design & Identity', 'Enterprise System',
  'Mobile App', 'UI/UX Design', 'Other',
];

const GRADIENTS = [
  { label: 'Purple → Pink',  value: 'from-purple-600 via-indigo-700 to-pink-500' },
  { label: 'Cyan → Violet',  value: 'from-cyan-600 via-violet-600 to-indigo-800' },
  { label: 'Pink → Purple',  value: 'from-pink-600 via-rose-700 to-purple-800' },
  { label: 'Violet → Amber', value: 'from-violet-700 via-pink-600 to-amber-600' },
  { label: 'Rose → Blue',    value: 'from-rose-600 via-purple-700 to-blue-600' },
  { label: 'Indigo → Green', value: 'from-indigo-600 via-purple-600 to-emerald-600' },
];

const empty = {
  title: '', slug: '', category: CATEGORIES[0], shortDesc: '', fullDesc: '',
  gradient: GRADIENTS[0].value, tags: [], image: '', video: '',
  status: 'draft', client: '', duration: '', scope: '',
  goals: [''], results: [''],
  stats: [{ val: '', lbl: '' }],
  galleryGradients: ['', '', ''],
};

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { addProject, updateProject, getProject, uploadFile } = useProjects();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (isEdit && id) {
      const p = getProject(id);
      if (p) {
        setForm({
          ...empty,
          ...p,
          galleryGradients: p.galleryGradients && p.galleryGradients.length === 3 
            ? p.galleryGradients 
            : ['', '', '']
        });
      }
    }
  }, [id, isEdit, getProject]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleTitleChange = (e) => {
    const t = e.target.value;
    set('title', t);
    if (!isEdit) set('slug', toSlug(t));
  };

  // Dynamic list helpers
  const addListItem = (key) => set(key, [...form[key], '']);
  const setListItem = (key, i, val) => set(key, form[key].map((v, idx) => idx === i ? val : v));
  const removeListItem = (key, i) => set(key, form[key].filter((_, idx) => idx !== i));

  const addStat = () => set('stats', [...form.stats, { val: '', lbl: '' }]);
  const setStat = (i, field, val) => set('stats', form.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const removeStat = (i) => set('stats', form.stats.filter((_, idx) => idx !== i));
  const setGalleryGradient = (i, val) => set('galleryGradients', form.galleryGradients.map((g, idx) => idx === i ? val : g));

  const handleSave = async (status) => {
    if (!form.title.trim()) { addToast('Title is required', 'error'); return; }
    setSaving(true);
    
    try {
      let finalImageUrl = form.image;
      let finalVideoUrl = form.video;

      // 1. Upload thumbnail file if new file selected
      if (imageFile) {
        addToast('Uploading thumbnail image...', 'info');
        finalImageUrl = await uploadFile(imageFile);
      }

      // 2. Upload video file if new file selected
      if (videoFile) {
        addToast('Uploading preview video...', 'info');
        finalVideoUrl = await uploadFile(videoFile);
      }

      const payload = { 
        ...form, 
        image: finalImageUrl,
        video: finalVideoUrl,
        status 
      };

      if (isEdit) {
        await updateProject(id, payload);
        addToast('Project updated successfully!', 'success');
      } else {
        await addProject(payload);
        addToast('Project created successfully!', 'success');
      }
      navigate('/projects');
    } catch (err) {
      console.error('Error saving project:', err);
      addToast(err.message || 'Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = ['basic', 'media', 'case-study'];

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Back + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => navigate('/projects')}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            {isEdit ? `Edit: ${form.title}` : 'New Project'}
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {isEdit ? 'Update project details below' : 'Fill in the details to add a new portfolio project'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="form-tabs" style={{ marginBottom: 22 }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '10px 20px', fontWeight: 600, fontSize: '0.825rem',
              borderBottom: activeTab === t ? '2px solid var(--purple)' : '2px solid transparent',
              color: activeTab === t ? 'var(--purple)' : 'var(--text-muted)',
              textTransform: 'capitalize', background: 'none', border: 'none',
              borderBottom: activeTab === t ? '2px solid var(--purple)' : '2px solid transparent',
              transition: 'color 0.2s',
            }}
          >
            {t === 'case-study' ? 'Case Study' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

        {/* ── BASIC TAB ── */}
        {activeTab === 'basic' && (
          <div className="glass" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div className="grid-2col">
              <div>
                <label className="form-label">Project Title *</label>
                <input className="form-input" value={form.title} onChange={handleTitleChange} placeholder="My Awesome Project" />
              </div>
              <div>
                <label className="form-label">Slug</label>
                <input className="form-input" value={form.slug} onChange={e => set('slug', toSlug(e.target.value))} placeholder="my-awesome-project" />
              </div>
            </div>
            <div className="grid-2col">
              <div>
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Gradient Colour</label>
                <select className="form-input" value={form.gradient} onChange={e => set('gradient', e.target.value)}>
                  {GRADIENTS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
                <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: `linear-gradient(to right, var(--tw-gradient-stops))` }} className={`bg-gradient-to-r ${form.gradient}`} />
              </div>
            </div>
            <div>
              <label className="form-label">Short Description</label>
              <textarea className="form-input" rows={2} value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} placeholder="One-line summary shown on project cards…" style={{ minHeight: 70 }} />
            </div>
            <div>
              <label className="form-label">Full Description</label>
              <textarea className="form-input" rows={5} value={form.fullDesc} onChange={e => set('fullDesc', e.target.value)} placeholder="Detailed description shown in the case study page…" />
            </div>
            <TagInput label="Technology Tags" value={form.tags} onChange={v => set('tags', v)} placeholder="Next.js, React, etc." />
          </div>
        )}

        {/* ── MEDIA TAB ── */}
        {activeTab === 'media' && (
          <div className="glass" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 26 }}>
            <MediaUploader
              label="Thumbnail Image"
              accept="image/png,image/jpeg,image/webp"
              type="image"
              value={form.image || null}
              onChange={(file, url) => {
                setImageFile(file);
                set('image', url || '');
              }}
            />
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            <MediaUploader
              label="Preview Video (plays on hover)"
              accept="video/mp4,video/webm,video/quicktime"
              type="video"
              value={form.video || null}
              onChange={(file, url) => {
                setVideoFile(file);
                set('video', url || '');
              }}
            />
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                💡 <strong style={{ color: 'var(--purple)' }}>Tip:</strong> Upload a short 5–20 second looping clip. It will auto-play silently when users hover over your project card on the portfolio. Recommended: 720p or 1080p MP4.
              </p>
            </div>
          </div>
        )}

        {/* ── CASE STUDY TAB ── */}
        {activeTab === 'case-study' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Client info */}
            <div className="glass" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: 18, fontSize: '0.95rem' }}>Client Information</h3>
              <div className="grid-3col">
                <div><label className="form-label">Client Name</label><input className="form-input" value={form.client} onChange={e => set('client', e.target.value)} placeholder="Acme Corp." /></div>
                <div><label className="form-label">Duration</label><input className="form-input" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="3 Months" /></div>
                <div><label className="form-label">Scope</label><input className="form-input" value={form.scope} onChange={e => set('scope', e.target.value)} placeholder="Design & Dev" /></div>
              </div>
            </div>

            {/* Goals */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Client Goals</h3>
                <button type="button" className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.75rem' }} onClick={() => addListItem('goals')}>
                  <Plus size={13} /> Add Goal
                </button>
              </div>
              {form.goals.map((g, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input className="form-input" value={g} onChange={e => setListItem('goals', i, e.target.value)} placeholder={`Goal ${i + 1}…`} />
                  {form.goals.length > 1 && <button className="btn-danger" style={{ padding: '0 12px', flexShrink: 0 }} onClick={() => removeListItem('goals', i)}><Trash2 size={13} /></button>}
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Results Achieved</h3>
                <button type="button" className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.75rem' }} onClick={() => addListItem('results')}>
                  <Plus size={13} /> Add Result
                </button>
              </div>
              {form.results.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input className="form-input" value={r} onChange={e => setListItem('results', i, e.target.value)} placeholder={`Result ${i + 1}…`} />
                  {form.results.length > 1 && <button className="btn-danger" style={{ padding: '0 12px', flexShrink: 0 }} onClick={() => removeListItem('results', i)}><Trash2 size={13} /></button>}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Key Stats</h3>
                <button type="button" className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.75rem' }} onClick={addStat}>
                  <Plus size={13} /> Add Stat
                </button>
              </div>
              {form.stats.map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <input className="form-input" value={s.val} onChange={e => setStat(i, 'val', e.target.value)} placeholder="+140%" />
                  <input className="form-input" value={s.lbl} onChange={e => setStat(i, 'lbl', e.target.value)} placeholder="User Expansion" />
                  {form.stats.length > 1 && <button className="btn-danger" style={{ padding: '0 12px', height: 40 }} onClick={() => removeStat(i)}><Trash2 size={13} /></button>}
                </div>
              ))}
            </div>

            {/* Artifact Gallery Gradients */}
            <div className="glass" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: 6, fontSize: '0.95rem' }}>Artifact Gallery Gradients</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 18 }}>Specify Tailwind gradient source colors for each mockup frame shown in the dynamic artifact gallery.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[0, 1, 2].map((idx) => (
                  <div key={idx}>
                    <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mockup Frame 0{idx + 1} Gradient</label>
                    <input 
                      className="form-input" 
                      value={form.galleryGradients[idx] || ''} 
                      onChange={e => setGalleryGradient(idx, e.target.value)} 
                      placeholder="from-purple-900 via-indigo-950 to-navy-black"
                    />
                    {form.galleryGradients[idx] && (
                      <div 
                        style={{ marginTop: 8, height: 10, borderRadius: 5, background: `linear-gradient(to right, var(--tw-gradient-stops))` }} 
                        className={`bg-gradient-to-r ${form.galleryGradients[idx]}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Save Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button className="btn-secondary" onClick={() => navigate('/projects')}>Cancel</button>
        <button className="btn-secondary" style={{ gap: 7 }} onClick={() => handleSave('draft')} disabled={saving}>
          <FileText size={15} /> {saving ? 'Saving…' : 'Save as Draft'}
        </button>
        <button className="btn-primary" onClick={() => handleSave('published')} disabled={saving}>
          <Globe size={15} /> {saving ? 'Publishing…' : 'Publish Project'}
        </button>
      </div>
    </div>
  );
}
