import React, { useState, useRef } from "react";
import Button from "./Button";

type ImageUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  error?: string;
  className?: string;
};

export default function ImageUpload({ value, onChange, label, error, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    
    setUploading(true);
    try {
      // Simulate upload - in real app, upload to server
      await new Promise(resolve => setTimeout(resolve, 1000));
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onChange(url);
    if (url) {
      setPreview(url);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      
      <div className="space-y-4">
        {/* File Upload */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            label="Chọn ảnh"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            size="sm"
          />
          <Button
            label="Tải lên"
            variant="primary"
            onClick={handleUpload}
            loading={uploading}
            disabled={!fileInputRef.current?.files?.[0]}
            size="sm"
          />
        </div>

        {/* URL Input */}
        <div>
          <input
            type="url"
            placeholder="Hoặc nhập URL ảnh..."
            value={value || ""}
            onChange={handleUrlChange}
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-700"
            />
            <button
              onClick={() => {
                setPreview(null);
                onChange("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}

