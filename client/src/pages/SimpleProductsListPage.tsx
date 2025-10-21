import React from "react";
import { Link } from "react-router-dom";

export default function SimpleProductsListPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Merchio - Sản phẩm</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Sản phẩm {i}</h3>
            <p className="text-gray-400 mb-4">Mô tả sản phẩm {i}</p>
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-bold text-lg">199,000 VND</span>
              <Link 
                to={`/products/${i}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          to="/admin/products/new"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Thêm sản phẩm mới
        </Link>
      </div>
    </div>
  );
}
