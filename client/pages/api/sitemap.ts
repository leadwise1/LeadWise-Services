// client/pages/api/sitemap.ts
import type { NextApiRequest, NextApiResponse } from "next";

const baseUrl = "https://services.letsleadwise.org";

const pages = [
  "/",
  "/courses",
  "/templates",
  "/editor",
  "/admin",
];

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => `<url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`)
    .join("")}
</urlset>`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(generateSiteMap());
}
