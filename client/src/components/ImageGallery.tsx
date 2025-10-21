import React, { useState } from "react";

type ImageGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
};

export default function ImageGallery({ images, alt, className = "" }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <img
          src={images[selectedIndex]}
          alt={alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="text-center text-sm text-gray-400">
        {selectedIndex + 1} / {images.length}
      </div>
    </div>
  );
}

