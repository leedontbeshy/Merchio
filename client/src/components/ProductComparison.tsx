import React, { useState } from "react";
import { getProduct, type Product } from "../pages/data";
import Button from "./Button";
import Modal from "./Modal";
import Badge from "./Badge";
import Rating from "./Rating";

type ProductComparisonProps = {
  productIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
  className?: string;
};

export default function ProductComparison({ productIds, onRemove, onClear, className = "" }: ProductComparisonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const products = productIds.map(id => getProduct(id)).filter(Boolean) as Product[];

  if (products.length === 0) return null;

  const features = [
    { key: "name", label: "Tên sản phẩm" },
    { key: "price", label: "Giá" },
    { key: "rating", label: "Đánh giá" },
    { key: "stock", label: "Tồn kho" },
    { key: "category", label: "Danh mục" },
    { key: "views", label: "Lượt xem" },
    { key: "sales", label: "Đã bán" },
  ];

  const formatVnd = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <div className="font-semibold">So sánh sản phẩm</div>
              <div className="text-gray-400">{products.length} sản phẩm</div>
            </div>
            <div className="flex gap-2">
              <Button
                label="Xem so sánh"
                variant="primary"
                size="sm"
                onClick={() => setIsOpen(true)}
              />
              <Button
                label="Xóa tất cả"
                variant="ghost"
                size="sm"
                onClick={onClear}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="So sánh sản phẩm"
        size="xl"
      >
        <div className="space-y-4">
          {/* Product headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <button
                    onClick={() => onRemove(product.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                <div className="text-blue-400 font-semibold text-sm mt-1">
                  {formatVnd(product.price)}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 font-semibold">Đặc điểm</th>
                  {products.map((product) => (
                    <th key={product.id} className="text-center p-3 font-semibold">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.key} className="border-b border-gray-800">
                    <td className="p-3 font-medium">{feature.label}</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-3 text-center">
                        {feature.key === "price" && formatVnd(product.price)}
                        {feature.key === "rating" && <Rating value={product.rating} />}
                        {feature.key === "stock" && (
                          <Badge 
                            variant={product.stock === 0 ? "danger" : product.stock < 10 ? "warning" : "success"}
                          >
                            {product.stock}
                          </Badge>
                        )}
                        {feature.key === "name" && product.name}
                        {feature.key === "category" && product.category}
                        {feature.key === "views" && product.views}
                        {feature.key === "sales" && product.sales}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Specifications comparison */}
          <div>
            <h4 className="font-semibold mb-3">Thông số kỹ thuật</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 font-semibold">Thông số</th>
                    {products.map((product) => (
                      <th key={product.id} className="text-center p-3 font-semibold">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(products[0]?.specifications || {}).map((spec) => (
                    <tr key={spec} className="border-b border-gray-800">
                      <td className="p-3 font-medium">{spec}</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-3 text-center">
                          {product.specifications[spec] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

