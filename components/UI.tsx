
import React, { useEffect } from 'react';
import { Notification, NotificationType } from '../types';
import { CheckIcon, XMarkIcon, FlagIcon } from './Icons';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  // UNIFIED BUTTON STYLES: h-8 (fine), text-[10px], uppercase, bold
  const baseClasses = 'relative h-8 px-4 rounded flex items-center justify-center font-bold uppercase tracking-wider text-[10px] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 dark:focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Elegant Flat/Gradient Styles
  const variantClasses = {
    primary: 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-md shadow-yellow-500/10 active:translate-y-0.5',
    secondary: 'bg-white dark:bg-[#222] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm active:translate-y-0.5',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:text-red-400 border border-red-200 dark:border-red-900/30 active:translate-y-0.5',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

// Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, id }) => {
  return (
    <div id={id} className={`bg-white dark:bg-[#111] p-3 rounded-lg shadow-sm border border-gray-100 dark:border-white/10 ${className || ''}`}>
      {children}
    </div>
  );
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div className="w-full group">
      <label htmlFor={id} className="block text-[9px] font-bold text-gray-700 dark:text-gray-200 mb-0.5 uppercase tracking-wider group-focus-within:text-yellow-600 dark:group-focus-within:text-yellow-500 transition-colors">{label}</label>
      <input
        id={id}
        // Thinner input: h-8
        className={`w-full px-2 h-8 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 text-gray-900 dark:text-gray-100 text-xs font-medium transition-all ${className || ''}`}
        {...props}
      />
    </div>
  );
};

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, className, ...props }) => {
  return (
    <div className="w-full group">
      {label && <label htmlFor={id} className="block text-[9px] font-bold text-gray-700 dark:text-gray-200 mb-0.5 uppercase tracking-wider group-focus-within:text-yellow-600 dark:group-focus-within:text-yellow-500 transition-colors">{label}</label>}
      <div className="relative">
        <select
            id={id}
            // Thinner select: h-8
            className={`w-full pl-2 pr-6 h-8 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 text-gray-900 dark:text-gray-100 text-xs font-medium transition-all appearance-none cursor-pointer ${className || ''}`}
            {...props}
        >
            {children}
        </select>
        {/* Custom arrow for cleaner look */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

// Confirmation Dialog
interface ConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title = "Confirmación", message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111] rounded-xl border border-white/10 max-w-sm w-full p-5 shadow-2xl">
                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs leading-relaxed">{message}</p>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={onConfirm}>
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Toast Notification
interface ToastProps {
    notification: Notification | null;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    if (!notification) return null;

    const bgColors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };

    const icons = {
        success: <CheckIcon className="w-4 h-4 text-white" />,
        error: <XMarkIcon className="w-4 h-4 text-white" />,
        info: <FlagIcon className="w-4 h-4 text-white" />
    };

    return (
        <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${bgColors[notification.type]} min-w-[300px] justify-center`}>
            {icons[notification.type]}
            <p className="text-[10px] font-bold uppercase tracking-wide">{notification.message}</p>
        </div>
    );
};
