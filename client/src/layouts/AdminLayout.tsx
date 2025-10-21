import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/", label: "Sản phẩm", icon: "📦" },
    { path: "/admin/products/new", label: "Thêm sản phẩm", icon: "➕" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🛍️</span>
              Merchio Admin
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}


