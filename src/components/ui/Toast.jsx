import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

/** Provides `toast({ type: 'success' | 'error', message })`. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    ({ type = 'success', message }) => {
      const id = ++nextId.current;
      setToasts((list) => [...list, { id, type, message }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-center gap-2 sm:left-auto sm:right-6 sm:items-end">
        {toasts.map((t) => {
          const Icon = t.type === 'error' ? AlertCircle : CheckCircle2;
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-lg ${
                t.type === 'error' ? 'bg-red-700' : 'border border-white/10 bg-night-700'
              }`}
            >
              <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="flex-1">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="shrink-0 opacity-80 hover:opacity-100">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
