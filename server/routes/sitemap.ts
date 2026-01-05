import { RequestHandler } from "express";

const baseUrl = "https://services.letsleadwise.org";

// We removed "/admin" from this list so Google doesn't find it.
const pages = [
  "/",
  "/courses",
  "/templates",
  "/editor",
];

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("")}
</urlset>`;
}

export const handleSitemap: RequestHandler = (_req, res) => {
  res.setHeader("Content-Type", "application/xml");
  // Set cache control so Google doesn't hit it too often, but gets updates
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.status(200).send(generateSiteMap());
};
