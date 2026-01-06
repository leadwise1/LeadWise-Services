const baseUrl = "https://services.letsleadwise.org";

const pages = [
  "/",
  "/courses",
  "/resume",
  "/cover-letter",
];

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((page) => {
      return `
  <url>
    <loc></loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;
    }).join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
