import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import ImageUpload from "../components/ImageUpload";
import { getProduct, listCategories, upsertProduct } from "./data";

type FormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  rating: string;
  stock: string;
  imageUrl: string;
  tags: string;
  isActive: boolean;
  specifications: Record<string, string>;
};

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categories = listCategories().filter((c) => c !== "all");

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    price: "",
    category: categories[0] || "Apparel",
    rating: "3",
    stock: "0",
    imageUrl: "",
    tags: "",
    isActive: true,
    specifications: {},
  });

  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  useEffect(() => {
    if (id) {
      const p = getProduct(id);
      if (p) {
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          category: p.category,
          rating: String(p.rating),
          stock: String(p.stock),
          imageUrl: p.imageUrl,
          tags: p.tags.join(", "),
          isActive: p.isActive,
          specifications: p.specifications,
        });
      }
    }
  }, [id]);

  function handleChange<K extends keyof FormState>(key: K, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSpecification() {
    if (specKey.trim() && specValue.trim()) {
      setForm(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey("");
      setSpecValue("");
    }
  }

  function removeSpecification(key: string) {
    setForm(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      id,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      category: form.category,
      rating: Math.max(0, Math.min(5, Number(form.rating) || 0)),
      stock: Math.max(0, Number(form.stock) || 0),
      imageUrl: form.imageUrl.trim() || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
      tags: form.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      isActive: form.isActive,
      specifications: form.specifications,
    };
    upsertProduct(payload);
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{id ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h1>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Kích hoạt</span>
          </label>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input 
            label="Tên sản phẩm" 
            value={form.name} 
            onChange={(e) => handleChange("name", e.target.value)} 
            required 
          />
          <Input 
            label="Giá (VND)" 
            type="number"
            value={form.price} 
            onChange={(e) => handleChange("price", e.target.value)} 
            required 
          />
          <Select
            label="Danh mục"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            options={categories.map((c) => ({ label: c, value: c }))}
          />
          <Select
            label="Đánh giá"
            value={form.rating}
            onChange={(e) => handleChange("rating", e.target.value)}
            options={[0, 1, 2, 3, 4, 5].map((n) => ({ label: `${n} sao`, value: String(n) }))}
          />
          <Input 
            label="Tồn kho" 
            type="number"
            value={form.stock} 
            onChange={(e) => handleChange("stock", e.target.value)} 
          />
          <Input 
            label="Tags (phân cách bằng dấu phẩy)" 
            value={form.tags} 
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="cotton, casual, basic"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Hình ảnh</h2>
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => handleChange("imageUrl", url)}
          label="Ảnh sản phẩm"
        />
      </div>

      {/* Description */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Mô tả</h2>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
          placeholder="Mô tả chi tiết về sản phẩm..."
        />
      </div>

      {/* Specifications */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h2>
        
        {/* Add new spec */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Tên thông số"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            placeholder="Ví dụ: Material"
          />
          <Input
            label="Giá trị"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            placeholder="Ví dụ: 100% Cotton"
          />
          <div className="flex items-end">
            <Button
              type="button"
              label="Thêm"
              variant="primary"
              onClick={addSpecification}
              disabled={!specKey.trim() || !specValue.trim()}
            />
          </div>
        </div>

        {/* Existing specs */}
        <div className="space-y-2">
          {Object.entries(form.specifications).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
              <span className="font-medium text-sm">{key}:</span>
              <span className="text-gray-300 text-sm">{value}</span>
              <button
                type="button"
                onClick={() => removeSpecification(key)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" label={id ? "Lưu thay đổi" : "Tạo sản phẩm"} variant="primary" />
        <Button type="button" label="Hủy" variant="ghost" onClick={() => history.back()} />
      </div>
    </form>
  );
}


