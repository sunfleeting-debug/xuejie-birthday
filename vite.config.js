import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 部署在 https://<用户名>.github.io/<仓库名>/ 时，
// 资源必须带上前缀。构建时用 `BASE=/<仓库名>/ npm run build` 指定。
// 本地开发或部署到自定义域名根路径时，保持默认 "/" 即可。
const base = process.env.BASE || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
