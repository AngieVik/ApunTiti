import React, { useEffect, useId } from "react";
import { Notification } from "../types";
import { CheckIcon, XMarkIcon, FlagIcon } from "./Icons";
import { APP_STYLES } from "../theme/styles";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

// Button
interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const variantClass =
    variant === "primary"
      ? APP_STYLES.MODOS.uiButtonPrimary
      : variant === "secondary"
      ? APP_STYLES.MODOS.uiButtonSecondary
      : APP_STYLES.MODOS.uiButtonDanger;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`${APP_STYLES.MODOS.uiButtonBase} ${variantClass} ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </motion.button>
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      id={id}
      className={`${APP_STYLES.MODOS.uiCard} ${className || ""}`}
    >
      {children}
    </motion.div>
  );
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={APP_STYLES.MODOS.uiInputWrapper}>
      <label htmlFor={inputId} className={APP_STYLES.MODOS.uiInputLabel}>
        {label}
      </label>
      <input
        id={inputId}
        className={`${APP_STYLES.MODOS.uiInputField} ${className || ""}`}
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

export const Select: React.FC<SelectProps> = ({
  label,
  id,
  children,
  className,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={APP_STYLES.MODOS.uiSelectWrapper}>
      {label && (
        <label htmlFor={selectId} className={APP_STYLES.MODOS.uiSelectLabel}>
          {label}
        </label>
      )}
      <div className={APP_STYLES.MODOS.uiSelectContainer}>
        <select
          id={selectId}
          className={`${APP_STYLES.MODOS.uiSelectField} ${className || ""}`}
          {...props}
        >
          {children}
        </select>
        {/* Custom arrow for cleaner look */}
        <div className={APP_STYLES.MODOS.uiSelectArrow} aria-hidden="true">
          <svg
            className="fill-current h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
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

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = "Confirmación",
  message,
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const descId = useId();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={APP_STYLES.MODOS.confirmDialogOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={APP_STYLES.MODOS.confirmDialogContent}
          >
            <h3 id={titleId} className={APP_STYLES.MODOS.confirmDialogTitle}>
              {title}
            </h3>
            <p id={descId} className={APP_STYLES.MODOS.confirmDialogMessage}>
              {message}
            </p>
            <div className={APP_STYLES.MODOS.confirmDialogActions}>
              <Button variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={onConfirm}>
                Confirmar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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

  const bgClass =
    notification.type === "success"
      ? APP_STYLES.MODOS.toastSuccess
      : notification.type === "error"
      ? APP_STYLES.MODOS.toastError
      : APP_STYLES.MODOS.toastInfo;

  const icons = {
    success: <CheckIcon className="w-4 h-4 text-white" />,
    error: <XMarkIcon className="w-4 h-4 text-white" />,
    info: <FlagIcon className="w-4 h-4 text-white" />,
  };

  return (
    <div className={`${APP_STYLES.MODOS.toastContainer} ${bgClass}`}>
      {icons[notification.type]}
      <p className={APP_STYLES.MODOS.toastText}>{notification.message}</p>
    </div>
  );
};
