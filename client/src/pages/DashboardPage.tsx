import React, { useMemo } from "react";
import { getProductStats, listProducts, getReviews } from "./data";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const stats = useMemo(() => getProductStats(), []);
  const products = useMemo(() => listProducts({ pageSize: 1000 }).products, []);
  const reviews = useMemo(() => getReviews(), []);

  const topProducts = products
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const lowStockProducts = products.filter(p => p.stock < 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const recentReviews = reviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatVnd = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/admin/products/new">
          <Button label="Thêm sản phẩm mới" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tổng sản phẩm</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Danh mục</p>
              <p className="text-2xl font-bold">{stats.totalCategories}</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tổng lượt xem</p>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tổng đánh giá</p>
              <p className="text-2xl font-bold">{stats.totalReviews}</p>
            </div>
            <div className="p-3 bg-purple-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="font-semibold text-yellow-400">Cảnh báo tồn kho</h3>
          </div>
          <div className="space-y-1 text-sm">
            {outOfStockProducts.length > 0 && (
              <p className="text-red-400">
                {outOfStockProducts.length} sản phẩm hết hàng
              </p>
            )}
            {lowStockProducts.length > 0 && (
              <p className="text-yellow-400">
                {lowStockProducts.length} sản phẩm sắp hết hàng
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Sản phẩm xem nhiều</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                  <p className="text-gray-400 text-xs">{product.views} lượt xem</p>
                </div>
                <Badge variant="info">{formatVnd(product.price)}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Đánh giá gần đây</h3>
          <div className="space-y-3">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => {
                const product = products.find(p => p.id === review.productId);
                return (
                  <div key={review.id} className="border-b border-gray-700 pb-3 last:border-b-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.userName}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-600"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-2">{review.comment}</p>
                    {product && (
                      <p className="text-blue-400 text-xs mt-1">Sản phẩm: {product.name}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">Chưa có đánh giá nào</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/products/new">
            <div className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition-colors">
              <svg className="h-8 w-8 text-white mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-white font-medium">Thêm sản phẩm</p>
            </div>
          </Link>
          
          <Link to="/">
            <div className="bg-green-600 hover:bg-green-700 rounded-lg p-4 text-center transition-colors">
              <svg className="h-8 w-8 text-white mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-white font-medium">Xem sản phẩm</p>
            </div>
          </Link>

          <div className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition-colors cursor-pointer">
            <svg className="h-8 w-8 text-white mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-white font-medium">Báo cáo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

