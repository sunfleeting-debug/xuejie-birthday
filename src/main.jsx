import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import "./styles/global.css";

/**
 * 用 HashRouter：GitHub Pages 是纯静态托管，
 * hash 路由刷新任意页面都不会 404，也不需要额外的 404.html 兜底。
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
