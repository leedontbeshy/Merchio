import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Rating from "./Rating";
import Badge from "./Badge";
import { type Product } from "../pages/data";

type ProductCardProps = {
  product: Product;
  onFavoriteToggle?: (productId: string) => void;
  isFavorite?: boolean;
  className?: string;
};

export default function ProductCard({ product, onFavoriteToggle, isFavorite, className = "" }: ProductCardProps) {
  const formatVnd = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {onFavoriteToggle && (
          <button
            onClick={() => onFavoriteToggle(product.id)}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
          >
            {isFavorite ? (
              <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="danger">Hết hàng</Badge>
          </div>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute top-2 left-2">
            <Badge variant="warning">Sắp hết</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="text-sm text-gray-400 line-clamp-2 mb-3">
          {product.description}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-400 font-semibold">{formatVnd(product.price)}</span>
          <Rating value={product.rating} />
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
          ))}
          {product.tags.length > 2 && (
            <Badge variant="secondary" size="sm">+{product.tags.length - 2}</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/products/${product.id}`} className="flex-1">
            <Button label="Xem chi tiết" variant="primary" size="sm" className="w-full" />
          </Link>
          <Link to={`/admin/products/${product.id}/edit`}>
            <Button label="Sửa" variant="secondary" size="sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}

