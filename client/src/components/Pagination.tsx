import React from "react";
import Button from "./Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageSize = false,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          label="Trước"
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-1 text-gray-400">...</span>
            ) : (
              <Button
                label={String(page)}
                variant={currentPage === page ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(Number(page))}
              />
            )}
          </React.Fragment>
        ))}

        <Button
          label="Sau"
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
}

