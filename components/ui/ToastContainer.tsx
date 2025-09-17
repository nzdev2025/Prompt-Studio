
import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const toastConfig = {
    success: {
        icon: CheckCircle,
        bg: 'bg-green-500',
    },
    error: {
        icon: AlertTriangle,
        bg: 'bg-red-500',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-500',
    }
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3">
      {toasts.map(toast => {
        const { icon: Icon, bg } = toastConfig[toast.type];
        return (
            <div
            key={toast.id}
            className={`${bg} text-white px-4 py-3 rounded-md shadow-lg flex items-center animate-fade-in-up`}
            >
                <Icon className="h-5 w-5 mr-3" />
                <span className="flex-grow">{toast.message}</span>
                <button onClick={() => removeToast(toast.id)} className="ml-4 p-1 rounded-full hover:bg-white/20">
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
      })}
    </div>
  );
};

export default ToastContainer;
