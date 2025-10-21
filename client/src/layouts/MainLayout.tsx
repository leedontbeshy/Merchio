import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">Merchio</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:underline">Sản phẩm</Link>
            <Link to="/admin/products/new" className="hover:underline">Thêm sản phẩm</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Merchio
      </footer>
    </div>
  );
}



