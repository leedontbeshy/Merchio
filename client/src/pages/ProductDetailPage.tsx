import React, { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import Rating from "../components/Rating";
import Badge from "../components/Badge";
import ImageGallery from "../components/ImageGallery";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import ProductCard from "../components/ProductCard";
import { 
  getProduct, 
  getReviews, 
  addReview, 
  updateReviewHelpful,
  getRelatedProducts,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  type Product,
  type Review
} from "./data";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const product = id ? getProduct(id) : undefined;
  const reviews = useMemo(() => id ? getReviews(id) : [], [id]);
  const relatedProducts = useMemo(() => id ? getRelatedProducts(id) : [], [id]);
  const isProductFavorite = useMemo(() => id ? isFavorite(id) : false, [id]);

  if (!product) {
    return (
      <div className="text-center text-gray-300 py-16">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-400 mb-4">Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/" className="text-blue-400 underline hover:text-blue-300">
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    if (id) {
      if (isProductFavorite) {
        removeFromFavorites(id);
      } else {
        addToFavorites(id);
      }
    }
  };

  const handleReviewSubmit = (review: { userName: string; rating: number; comment: string }) => {
    if (id) {
      addReview({
        productId: id,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        helpful: 0,
      });
      setShowReviewForm(false);
    }
  };

  const handleReviewHelpful = (reviewId: string) => {
    updateReviewHelpful(reviewId);
  };

  // Generate multiple images for gallery (in real app, this would come from product data)
  const productImages = [
    product.imageUrl,
    product.imageUrl.replace("photo-1512436991641-6745cdb1723f", "photo-1505740420928-5e560c06d30e"),
    product.imageUrl.replace("photo-1512436991641-6745cdb1723f", "photo-1546421845-6471bdcf3ebf"),
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link to="/" className="hover:text-white">Trang chủ</Link>
        <span>›</span>
        <Link to="/" className="hover:text-white">Sản phẩm</Link>
        <span>›</span>
        <span className="text-white">{product.name}</span>
      </nav>

      {/* Product Info */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <ImageGallery images={productImages} alt={product.name} />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Rating value={product.rating} />
                <span className="text-sm text-gray-400">({reviews.length} đánh giá)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {product.views} lượt xem
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-400">
            {formatVnd(product.price)}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Danh mục:</span>
              <Badge variant="info">{product.category}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Tình trạng:</span>
              {product.stock === 0 ? (
                <Badge variant="danger">Hết hàng</Badge>
              ) : product.stock < 10 ? (
                <Badge variant="warning">Sắp hết hàng ({product.stock})</Badge>
              ) : (
                <Badge variant="success">Còn hàng ({product.stock})</Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Đã bán:</span>
              <span className="text-white">{product.sales}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleFavoriteToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isProductFavorite
                  ? "bg-red-600 border-red-600 text-white"
                  : "border-gray-600 text-gray-300 hover:border-gray-500"
              }`}
            >
              {isProductFavorite ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              {isProductFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
            </button>

            <Link to={`/admin/products/${product.id}/edit`}>
              <Button label="Chỉnh sửa" variant="secondary" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: "description", label: "Mô tả" },
            { id: "specifications", label: "Thông số kỹ thuật" },
            { id: "reviews", label: `Đánh giá (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === "description" && (
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Mô tả sản phẩm</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">{key}:</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Đánh giá khách hàng</h3>
              <Button
                label="Viết đánh giá"
                variant="primary"
                onClick={() => setShowReviewForm(!showReviewForm)}
              />
            </div>

            {showReviewForm && (
              <ReviewForm
                productId={product.id}
                onSubmit={handleReviewSubmit}
              />
            )}

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpful={handleReviewHelpful}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">💬</div>
                  <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                  <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">Sản phẩm liên quan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isFavorite(relatedProduct.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatVnd(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}


