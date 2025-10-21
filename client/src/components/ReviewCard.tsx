import React, { useState } from "react";
import Rating from "./Rating";
import Button from "./Button";

type Review = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
};

type ReviewCardProps = {
  review: Review;
  onHelpful: (reviewId: string) => void;
  className?: string;
};

export default function ReviewCard({ review, onHelpful, className = "" }: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpful = () => {
    if (!isHelpful) {
      onHelpful(review.id);
      setIsHelpful(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">
              {review.userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{review.userName}</p>
            <div className="flex items-center gap-2">
              <Rating value={review.rating} />
              <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-3 leading-relaxed">{review.comment}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={handleHelpful}
          disabled={isHelpful}
          className={`flex items-center gap-1 text-xs transition-colors ${
            isHelpful
              ? "text-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          {isHelpful ? "Đã hữu ích" : "Hữu ích"} ({review.helpful})
        </button>
      </div>
    </div>
  );
}

