import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
 base: "/",
 plugins: [react()],
 preview: {
  port: 5173,
 },
 server: {
  port: 5174,
  host: true,
  origin: "http://0.0.0.0:5174",
 },
});