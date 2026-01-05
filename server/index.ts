import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import { handleSitemap } from "./routes/sitemap";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- API Routes ---
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  
  // Serve sitemap at the root
  app.get("/sitemap.xml", handleSitemap);

  // --- CRITICAL FIX: Serve Frontend Files ---
  // 1. Tell Express where the built website files are (dist/spa)
  const distPath = path.join(process.cwd(), "dist/spa");
  app.use(express.static(distPath));

  // 2. Handle React Routing (The "Catch-All")
  // If the request isn't an API or a static file, send the main index.html
  // so React Router can handle pages like /courses or /admin
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  return app;
}
