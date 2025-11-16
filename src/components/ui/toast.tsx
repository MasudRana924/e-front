import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const existingToastsRef = useRef<Set<string>>(new Set());

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    // Create a unique key for this toast
    const toastKey = `${toast.type}-${toast.message}`;
    
    // Check if same message already exists
    if (!existingToastsRef.current.has(toastKey)) {
      existingToastsRef.current.add(toastKey);
      
      setToasts(prev => [...prev, newToast]);

      // Auto remove toast after duration
      setTimeout(() => {
        hideToast(id);
        existingToastsRef.current.delete(toastKey);
      }, toast.duration || 5000);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => {
      const updatedToasts = prev.filter(toast => toast.id !== id);
      // Clean up the ref when toast is manually closed
      if (updatedToasts.length < prev.length) {
        const removedToast = prev.find(t => t.id === id);
        if (removedToast) {
          const toastKey = `${removedToast.type}-${removedToast.message}`;
          existingToastsRef.current.delete(toastKey);
        }
      }
      return updatedToasts;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-primary/10 border-primary/20 dark:bg-primary/20 dark:border-primary/30';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-right-full duration-300',
        getBackgroundColor()
      )}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Simple toast functions for easy use
export const toast = {
  success: (message: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { type: 'success', message, duration }
      });
      window.dispatchEvent(event);
    }
  },
  error: (message: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { type: 'error', message, duration }
      });
      window.dispatchEvent(event);
    }
  },
  info: (message: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { type: 'info', message, duration }
      });
      window.dispatchEvent(event);
    }
  }
};
