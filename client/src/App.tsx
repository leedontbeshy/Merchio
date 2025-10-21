import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProductsListPage from "./pages/ProductsListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductFormPage from "./pages/ProductFormPage";
import DashboardPage from "./pages/DashboardPage";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<ProductsListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

