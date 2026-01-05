import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import { handleDemo } from "../server/routes/demo.js";
import { handleSitemap } from "../server/routes/sitemap.js";

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes - Note: /api prefix is already handled by Vercel routing
app.get("/ping", (_req, res) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  res.json({ message: ping });
});

app.get("/demo", handleDemo);
app.get("/sitemap.xml", handleSitemap);

// Wrap with serverless-http
const handler = serverless(app);

export default async function (req, res) {
  return handler(req, res);
}
