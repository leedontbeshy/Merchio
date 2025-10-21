import React, { useState } from "react";
import Button from "./Button";
import Rating from "./Rating";

type ReviewFormProps = {
  productId: string;
  onSubmit: (review: { userName: string; rating: number; comment: string }) => void;
  className?: string;
};

export default function ReviewForm({ productId, onSubmit, className = "" }: ReviewFormProps) {
  const [form, setForm] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.userName.trim() && form.comment.trim()) {
      onSubmit(form);
      setForm({ userName: "", rating: 5, comment: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Viết đánh giá</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tên của bạn
          </label>
          <input
            type="text"
            value={form.userName}
            onChange={(e) => setForm(prev => ({ ...prev, userName: e.target.value }))}
            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tên của bạn"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Đánh giá
          </label>
          <div className="flex items-center gap-2">
            <Rating value={form.rating} />
            <span className="text-sm text-gray-400">({form.rating}/5)</span>
          </div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, rating }))}
                className={`text-2xl transition-colors ${
                  rating <= form.rating ? "text-yellow-400" : "text-gray-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nhận xét
          </label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            required
          />
        </div>

        <Button type="submit" label="Gửi đánh giá" variant="primary" />
      </div>
    </form>
  );
}

