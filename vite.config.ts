
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  plugins: [
    react(),
    {
      name: "threadfind-api",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith("/api/search") && req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
              body += chunk;
            });
            req.on("end", async () => {
              try {
                const json = JSON.parse(body || "{}");
                const { handleSearch } = await import("./server/searchHandler");
                const response = await handleSearch(json);
                res.setHeader("Content-Type", "application/json");
                res.statusCode = response.success ? 200 : 400;
                res.end(JSON.stringify(response));
              } catch (err: any) {
                console.error("Vite API handler error:", err);
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message || "Internal server error" }));
              }
            });
            return;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
