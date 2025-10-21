import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Modal from "./Modal";

type FilterState = {
  minPrice: string;
  maxPrice: string;
  minRating: string;
  inStock: string;
  sortBy: string;
  sortOrder: string;
};

type AdvancedFilterProps = {
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  currentFilters?: Partial<FilterState>;
  className?: string;
};

export default function AdvancedFilter({ onApply, onReset, currentFilters = {}, className = "" }: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    inStock: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    ...currentFilters,
  });

  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      minPrice: "",
      maxPrice: "",
      minRating: "",
      inStock: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(resetFilters);
    onReset();
    setIsOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "all" && value !== "desc");

  return (
    <>
      <Button
        label="Bộ lọc nâng cao"
        variant="secondary"
        onClick={() => setIsOpen(true)}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        }
        className={hasActiveFilters ? "ring-2 ring-blue-500" : ""}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Bộ lọc nâng cao"
        size="lg"
      >
        <div className="space-y-6">
          {/* Price Range */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá tối thiểu (VND)"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
              placeholder="0"
            />
            <Input
              label="Giá tối đa (VND)"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
              placeholder="1000000"
            />
          </div>

          {/* Rating */}
          <div>
            <Select
              label="Đánh giá tối thiểu"
              value={filters.minRating}
              onChange={(e) => handleChange("minRating", e.target.value)}
              options={[
                { label: "Tất cả", value: "" },
                { label: "1 sao trở lên", value: "1" },
                { label: "2 sao trở lên", value: "2" },
                { label: "3 sao trở lên", value: "3" },
                { label: "4 sao trở lên", value: "4" },
                { label: "5 sao", value: "5" },
              ]}
            />
          </div>

          {/* Stock Status */}
          <div>
            <Select
              label="Tình trạng tồn kho"
              value={filters.inStock}
              onChange={(e) => handleChange("inStock", e.target.value)}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Còn hàng", value: "inStock" },
                { label: "Hết hàng", value: "outOfStock" },
                { label: "Sắp hết hàng (< 10)", value: "lowStock" },
              ]}
            />
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Sắp xếp theo"
              value={filters.sortBy}
              onChange={(e) => handleChange("sortBy", e.target.value)}
              options={[
                { label: "Ngày tạo", value: "createdAt" },
                { label: "Tên sản phẩm", value: "name" },
                { label: "Giá", value: "price" },
                { label: "Đánh giá", value: "rating" },
                { label: "Tồn kho", value: "stock" },
              ]}
            />
            <Select
              label="Thứ tự"
              value={filters.sortOrder}
              onChange={(e) => handleChange("sortOrder", e.target.value)}
              options={[
                { label: "Giảm dần", value: "desc" },
                { label: "Tăng dần", value: "asc" },
              ]}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              label="Đặt lại"
              variant="ghost"
              onClick={handleReset}
            />
            <Button
              label="Áp dụng"
              variant="primary"
              onClick={handleApply}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

