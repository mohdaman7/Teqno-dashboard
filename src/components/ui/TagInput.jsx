import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

export default function TagInput({ label, value = [], onChange, placeholder = 'Add tag…' }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const removeTag = (tag) => onChange(value.filter(t => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px',
          background: 'rgba(7,7,26,0.7)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', cursor: 'text', minHeight: 42,
          alignItems: 'center', transition: 'border-color 0.2s',
        }}
      >
        {value.map(tag => (
          <span key={tag} className="tag-chip">
            {tag}
            <button type="button" onClick={e => { e.stopPropagation(); removeTag(tag); }}>
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: '0.875rem',
            flex: 1, minWidth: 100,
          }}
        />
        {input && (
          <button type="button" onClick={addTag} style={{ display: 'flex', color: 'var(--purple)' }}>
            <Plus size={16} />
          </button>
        )}
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 5 }}>
        Press Enter or comma to add a tag
      </p>
    </div>
  );
}
