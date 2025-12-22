import React, { useEffect, useId, memo, useRef } from "react";
import { Notification } from "../types";
import { CheckIcon, XMarkIcon, FlagIcon } from "./Icons";
import { APP_STYLES } from "../theme/styles";
import {
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  INPUT_VARIANTS,
  SELECT_VARIANTS,
  type ButtonVariant,
  type ButtonSize,
  type CardVariant,
  type CardAccent,
  type InputState,
} from "../theme/tokens";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

// ─── BUTTON ────────────────────────────────────────────────────────────────
interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  /** Button style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon-only button (no text padding) */
  iconOnly?: boolean;
  "aria-label"?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  iconOnly = false,
  type = "button",
  disabled,
  ...props
}) => {
  const variantClass = BUTTON_VARIANTS.variants[variant];
  const sizeClass = iconOnly
    ? BUTTON_VARIANTS.iconOnly[size]
    : BUTTON_VARIANTS.sizes[size];

  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
      disabled={disabled || loading}
      className={`${BUTTON_VARIANTS.base} ${variantClass} ${sizeClass} ${
        className || ""
      }`}
      {...props}
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        children
      )}
    </motion.button>
  );
};

export const Button = memo(ButtonComponent);
Button.displayName = "Button";

// ─── CARD ──────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Card style variant */
  variant?: CardVariant;
  /** Accent border position */
  accent?: CardAccent;
  /** Disable entrance animation */
  noAnimation?: boolean;
}

const CardComponent: React.FC<CardProps> = ({
  children,
  className,
  id,
  variant = "default",
  accent = "none",
  noAnimation = false,
}) => {
  const variantClass = CARD_VARIANTS.variants[variant];
  const accentClass = CARD_VARIANTS.accents[accent];

  const motionProps = noAnimation
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
      };

  return (
    <motion.div
      {...motionProps}
      id={id}
      className={`${CARD_VARIANTS.base} ${variantClass} ${accentClass} ${
        className || ""
      }`}
    >
      {children}
    </motion.div>
  );
};

export const Card = memo(CardComponent);
Card.displayName = "Card";

// ─── INPUT ─────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Open picker on wrapper click (useful for date/time inputs) */
  clickToEdit?: boolean;
  /** Validation state */
  state?: InputState;
  /** Error message to display */
  errorMessage?: string;
}

const InputComponent: React.FC<InputProps> = ({
  label,
  id,
  className,
  clickToEdit = false,
  state = "default",
  errorMessage,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleWrapperClick = () => {
    if (clickToEdit && inputRef.current && !disabled) {
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current.click();
      }
    }
  };

  const stateClass = disabled
    ? INPUT_VARIANTS.field.states.disabled
    : INPUT_VARIANTS.field.states[state];

  return (
    <div
      className={INPUT_VARIANTS.wrapper}
      onClick={handleWrapperClick}
      style={clickToEdit && !disabled ? { cursor: "pointer" } : undefined}
    >
      <label htmlFor={inputId} className={INPUT_VARIANTS.label}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        disabled={disabled}
        className={`${INPUT_VARIANTS.field.base} ${
          INPUT_VARIANTS.field.sizes.md
        } ${stateClass} ${className || ""}`}
        {...props}
      />
      {errorMessage && state === "error" && (
        <p className="text-[9px] text-red-500 mt-0.5">{errorMessage}</p>
      )}
    </div>
  );
};

export const Input = memo(InputComponent);
Input.displayName = "Input";

// ─── SELECT ────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
  /** Validation state */
  state?: "default" | "error";
}

const SelectComponent: React.FC<SelectProps> = ({
  label,
  id,
  children,
  className,
  state = "default",
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  const stateClass = disabled
    ? SELECT_VARIANTS.field.states.disabled
    : SELECT_VARIANTS.field.states[state];

  return (
    <div className={SELECT_VARIANTS.wrapper}>
      {label && (
        <label htmlFor={selectId} className={SELECT_VARIANTS.label}>
          {label}
        </label>
      )}
      <div className={SELECT_VARIANTS.container}>
        <select
          id={selectId}
          disabled={disabled}
          className={`${SELECT_VARIANTS.field.base} ${
            SELECT_VARIANTS.field.sizes.md
          } ${stateClass} ${className || ""}`}
          {...props}
        >
          {children}
        </select>
        {/* Custom arrow for cleaner look */}
        <div className={SELECT_VARIANTS.arrow} aria-hidden="true">
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

export const Select = memo(SelectComponent);
Select.displayName = "Select";

// Confirmation Dialog
interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialogComponent: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = "Confirmación",
  message,
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const descId = useId();

  // Handle Escape key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

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
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={APP_STYLES.MODOS.confirmDialogContent}
            onClick={(e) => e.stopPropagation()}
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

export const ConfirmDialog = memo(ConfirmDialogComponent);
ConfirmDialog.displayName = "ConfirmDialog";

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
    <div
      className={`${APP_STYLES.MODOS.toastContainer} ${bgClass}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {icons[notification.type]}
      <p className={APP_STYLES.MODOS.toastText}>{notification.message}</p>
    </div>
  );
};
