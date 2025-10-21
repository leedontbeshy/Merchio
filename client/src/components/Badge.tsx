import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "secondary";
type BadgeSize = "sm" | "md" | "lg";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: React.ReactNode;
};

const variants: Record<BadgeVariant, string> = {
  default: "bg-gray-700 text-gray-200 border-gray-600",
  success: "bg-green-700 text-green-200 border-green-600",
  warning: "bg-yellow-700 text-yellow-200 border-yellow-600",
  danger: "bg-red-700 text-red-200 border-red-600",
  info: "bg-blue-700 text-blue-200 border-blue-600",
  secondary: "bg-purple-700 text-purple-200 border-purple-600",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export default function Badge({ children, variant = "default", size = "md", className = "", icon }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </span>
  );
}

