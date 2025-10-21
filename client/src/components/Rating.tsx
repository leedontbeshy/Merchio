import React from "react";

type RatingProps = {
  value: number; // 0..5
  outOf?: number;
};

export default function Rating({ value, outOf = 5 }: RatingProps) {
  const rounded = Math.max(0, Math.min(outOf, Math.round(value)));
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rounded}/${outOf}`}>
      {Array.from({ length: outOf }).map((_, i) => (
        <span key={i} className={i < rounded ? "text-yellow-400" : "text-gray-600"}>
          ★
        </span>
      ))}
    </div>
  );
}



