import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: Array<{ label: string; value: string | number }>;
};

export default function Select({ label, error, options, className = "", ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-gray-300">{label}</span>}
      <select
        {...props}
        className={`px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </label>
  );
}



