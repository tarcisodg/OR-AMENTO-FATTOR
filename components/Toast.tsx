import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'info';
  onClose: () => void;
}

const SuccessIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const InfoIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const toastConfig = {
    success: {
        icon: <SuccessIcon className="w-6 h-6 text-green-500" />,
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-800',
        hoverBg: 'hover:bg-green-100',
        ring: 'focus:ring-green-400',
        darkBg: 'dark:bg-slate-800',
        darkBorder: 'dark:border-green-600',
        darkText: 'dark:text-green-300',
        darkHoverBg: 'dark:hover:bg-slate-700'
    },
    info: {
        icon: <InfoIcon className="w-6 h-6 text-sky-500" />,
        bg: 'bg-sky-50',
        border: 'border-sky-300',
        text: 'text-sky-800',
        hoverBg: 'hover:bg-sky-100',
        ring: 'focus:ring-sky-400',
        darkBg: 'dark:bg-slate-800',
        darkBorder: 'dark:border-sky-600',
        darkText: 'dark:text-sky-300',
        darkHoverBg: 'dark:hover:bg-slate-700'
    }
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-dismiss after 3 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const config = toastConfig[type];

    return (
        <div className="fixed top-5 right-5 z-[200] w-full max-w-sm animate-slide-in-down">
            <div 
              className={`
                flex items-center p-4 rounded-lg shadow-xl border
                ${config.bg} ${config.border}
                ${config.darkBg} ${config.darkBorder}
              `}
              role="alert"
            >
                <div className="flex-shrink-0">
                    {config.icon}
                </div>
                <div className={`ml-3 text-sm font-medium ${config.text} ${config.darkText}`}>
                    {message}
                </div>
                <button 
                    type="button" 
                    className={`
                        ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8
                        ${config.bg} ${config.text} ${config.hoverBg} ${config.ring}
                        ${config.darkBg} ${config.darkText} ${config.darkHoverBg}
                    `}
                    onClick={onClose} 
                    aria-label="Fechar"
                >
                    <span className="sr-only">Fechar</span>
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Toast;