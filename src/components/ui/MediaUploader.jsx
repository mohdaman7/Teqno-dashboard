import { useState, useRef } from 'react';
import { Upload, Film, Image, X, CheckCircle } from 'lucide-react';

export default function MediaUploader({ label, accept = 'image/*', value, onChange, type = 'image' }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.(file, url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const Icon = type === 'video' ? Film : Image;

  return (
    <div>
      {label && <label className="form-label">{label}</label>}

      <div
        className={`dropzone ${dragging ? 'active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{ position: 'relative', minHeight: preview ? 200 : 140 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />

        {preview ? (
          <div style={{ position: 'relative' }}>
            {type === 'video' ? (
              <video
                src={preview}
                controls
                style={{ width: '100%', maxHeight: 220, borderRadius: 10, objectFit: 'cover' }}
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', maxHeight: 220, borderRadius: 10, objectFit: 'cover' }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'center' }}>
              <CheckCircle size={14} color="var(--emerald)" />
              <span style={{ fontSize: '0.775rem', color: 'var(--emerald)', fontWeight: 600 }}>
                File selected — click to replace
              </span>
            </div>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setPreview(null); onChange?.(null, null); }}
              style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(0,0,0,0.7)', border: 'none',
                borderRadius: '50%', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={22} color="var(--purple)" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--purple)' }}>Click to upload</span> or drag & drop
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {type === 'video' ? 'MP4, WebM, MOV (max 500MB)' : 'PNG, JPG, WebP (max 20MB)'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
