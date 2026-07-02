import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: '#34d399',
    error: '#f87171',
    info: '#c084fc',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => {
          const Icon = icons[t.type] || Info;
          return (
            <div key={t.id} className={`toast ${t.type}`}>
              <Icon size={18} style={{ color: colors[t.type], flexShrink: 0 }} />
              <span style={{ flex: 1, color: '#e2e8f0', fontSize: '0.875rem' }}>{t.message}</span>
              <button onClick={() => removeToast(t.id)} style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
