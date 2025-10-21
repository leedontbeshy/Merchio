import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

export default function Input({ label, error, icon, iconPosition = "left", className = "", ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-gray-300">{label}</span>}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            icon && iconPosition === "left" ? "pl-10" : ""
          } ${
            icon && iconPosition === "right" ? "pr-10" : ""
          } ${className}`}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </label>
  );
}


