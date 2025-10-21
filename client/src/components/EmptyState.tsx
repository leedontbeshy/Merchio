import React from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 border border-dashed border-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      {description && <p className="text-gray-400 mt-2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}



