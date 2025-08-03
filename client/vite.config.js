// import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react"

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3002,
//     proxy: {
//       "/api": {
//         target: "http://localhost:5001",
//         changeOrigin: true,
//       },
//     },
//   },
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      "/api": {
        target: "https://fcrm-02g1.onrender.com", // ✅ Use your Render backend URL
        changeOrigin: true,
        secure: false, // add this if you're using self-signed HTTPS (Render uses valid certs so this might be optional)
      },
    },
  },
});
