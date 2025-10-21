import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "success" | "warning" | "info";
type ButtonSize = "sm" | "md" | "lg" | "xl";

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

const base = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-lg",
  xl: "px-8 py-4 text-lg rounded-lg",
};

const styles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400 ring-offset-gray-900 shadow-lg hover:shadow-xl",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-400 ring-offset-gray-900 border border-gray-600",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400 ring-offset-gray-900 shadow-lg hover:shadow-xl",
  ghost: "bg-transparent hover:bg-gray-800 text-white border border-gray-700 hover:border-gray-600",
  success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400 ring-offset-gray-900 shadow-lg hover:shadow-xl",
  warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-400 ring-offset-gray-900 shadow-lg hover:shadow-xl",
  info: "bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-400 ring-offset-gray-900 shadow-lg hover:shadow-xl",
};

export default function Button({
  label,
  children,
  onClick,
  type = "button",
  disabled,
  loading,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const content = children || label;
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {content}
      {!loading && icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
}


