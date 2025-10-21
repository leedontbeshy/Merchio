import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import Rating from "../components/Rating";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import AdvancedFilter from "../components/AdvancedFilter";
import Modal from "../components/Modal";
import "../styles/products.css";
import { 
  listCategories, 
  listProducts, 
  deleteProduct, 
  addToFavorites, 
  removeFromFavorites, 
  isFavorite,
  type Product 
} from "./data";

export default function ProductsListPage() {
  const [params, setParams] = useSearchParams();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const q = params.get("q") || "";
  const category = params.get("category") || "all";
  const sortBy = params.get("sortBy") || "createdAt";
  const sortOrder = params.get("sortOrder") || "desc";
  const page = Number(params.get("page")) || 1;
  const pageSize = Number(params.get("pageSize")) || 12;
  const minPrice = params.get("minPrice") ? Number(params.get("minPrice")) : undefined;
  const maxPrice = params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined;
  const minRating = params.get("minRating") ? Number(params.get("minRating")) : undefined;
  const inStock = params.get("inStock") || "all";

  const categories = useMemo(() => listCategories(), []);
  const { products, total, totalPages } = useMemo(() => 
    listProducts({ 
      q, 
      category, 
      sortBy, 
      sortOrder, 
      page, 
      pageSize,
      minPrice,
      maxPrice,
      minRating,
      inStock
    }), 
    [q, category, sortBy, sortOrder, page, pageSize, minPrice, maxPrice, minRating, inStock]
  );

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page"); // Reset to page 1 when filtering
    setParams(next, { replace: true });
  }

  function handleDelete(id: string) {
    deleteProduct(id);
    setConfirming(null);
    setParams(new URLSearchParams(params), { replace: true });
  }

  function handleFavoriteToggle(productId: string) {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
    setParams(new URLSearchParams(params), { replace: true });
  }

  function handleAdvancedFilter(filters: any) {
    const next = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        next.set(key, String(value));
      }
    });
    setParams(next, { replace: true });
  }

  function handleFilterReset() {
    setParams(new URLSearchParams(), { replace: true });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <p className="text-gray-400">Hiển thị {products.length} trong {total} sản phẩm</p>
        </div>
        <Link to="/admin/products/new">
          <Button label="Thêm sản phẩm" icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          } />
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm sản phẩm, mô tả, tags..."
            value={q}
            onChange={(e) => updateParam("q", e.target.value)}
            icon={
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div className="flex gap-2">
          <div className="w-48">
            <Select
              value={category}
              onChange={(e) => updateParam("category", e.target.value)}
              options={categories.map((c) => ({ label: c === "all" ? "Tất cả danh mục" : c, value: c }))}
            />
          </div>
          <div className="w-48">
            <Select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("_");
                updateParam("sortBy", newSortBy);
                updateParam("sortOrder", newSortOrder);
              }}
              options={[
                { label: "Mới nhất", value: "createdAt_desc" },
                { label: "Cũ nhất", value: "createdAt_asc" },
                { label: "Tên A-Z", value: "name_asc" },
                { label: "Tên Z-A", value: "name_desc" },
                { label: "Giá thấp → cao", value: "price_asc" },
                { label: "Giá cao → thấp", value: "price_desc" },
                { label: "Đánh giá cao", value: "rating_desc" },
                { label: "Xem nhiều", value: "views_desc" },
                { label: "Bán chạy", value: "sales_desc" },
              ]}
            />
          </div>
          <AdvancedFilter
            onApply={handleAdvancedFilter}
            onReset={handleFilterReset}
            currentFilters={{
              minPrice: minPrice?.toString() || "",
              maxPrice: maxPrice?.toString() || "",
              minRating: minRating?.toString() || "",
              inStock,
              sortBy,
              sortOrder,
            }}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState title="Không có sản phẩm" description="Thử điều chỉnh bộ lọc hoặc thêm sản phẩm mới." />
      ) : (
        <>
          <div className="grid-products">
            {products.map((p) => (
              <article key={p.id} className="card overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <Link to={`/products/${p.id}`}>
                    <img src={p.imageUrl} alt={p.name} className="card-img group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <button
                    onClick={() => handleFavoriteToggle(p.id)}
                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    {isFavorite(p.id) ? (
                      <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                  {p.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="danger">Hết hàng</Badge>
                    </div>
                  )}
                  {p.stock > 0 && p.stock < 10 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="warning">Sắp hết</Badge>
                    </div>
                  )}
                </div>
                <div className="card-body flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <Link to={`/products/${p.id}`} className="font-semibold hover:underline line-clamp-1 flex-1">
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {p.views}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 line-clamp-2">{p.description}</div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold">{formatVnd(p.price)}</span>
                    <Rating value={p.rating} />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                    ))}
                    {p.tags.length > 2 && (
                      <Badge variant="secondary" size="sm">+{p.tags.length - 2}</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Link to={`/admin/products/${p.id}/edit`}>
                      <Button label="Sửa" variant="secondary" size="sm" />
                    </Link>
                    <Button 
                      label="Xóa" 
                      variant="danger" 
                      size="sm"
                      onClick={() => setConfirming(p.id)} 
                    />
                  </div>
                  
                  {confirming === p.id && (
                    <div className="text-sm text-gray-300 flex items-center gap-2 p-2 bg-gray-800 rounded">
                      Xóa sản phẩm?
                      <Button label="Có" variant="danger" size="sm" onClick={() => handleDelete(p.id)} />
                      <Button label="Không" variant="ghost" size="sm" onClick={() => setConfirming(null)} />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => updateParam("page", String(newPage))}
              showPageSize={true}
              pageSize={pageSize}
              onPageSizeChange={(newSize) => updateParam("pageSize", String(newSize))}
              pageSizeOptions={[12, 24, 48, 96]}
            />
          )}
        </>
      )}
    </div>
  );
}

function formatVnd(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}


