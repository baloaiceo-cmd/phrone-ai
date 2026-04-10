import { Router } from "express";
import { getPublishedArticles, getAllCategories } from "./db";

const rssRouter = Router();

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

rssRouter.get("/api/rss.xml", async (_req, res) => {
  try {
    const articles = await getPublishedArticles(50, 0);
    const categories = await getAllCategories();
    const catMap: Record<string, string> = {};
    categories.forEach((c) => {
      catMap[c.key] = c.nameEn;
    });

    const baseUrl = "https://phrone.ai";
    const now = new Date().toUTCString();

    const items = articles
      .map((a) => {
        const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : now;
        const category = catMap[a.categoryKey] || a.categoryKey;
        return `    <item>
      <title>${escapeXml(a.titleEn)}</title>
      <link>${baseUrl}/article/${a.id}</link>
      <guid isPermaLink="true">${baseUrl}/article/${a.id}</guid>
      <description>${escapeXml(a.excerptEn)}</description>
      <category>${escapeXml(category)}</category>
      <author>${escapeXml(a.author)}</author>
      <pubDate>${pubDate}</pubDate>
      ${a.image ? `<enclosure url="${escapeXml(a.image)}" type="image/png" />` : ""}
    </item>`;
      })
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Phrone AI</title>
    <link>${baseUrl}</link>
    <description>AI industry insights, research analysis, and technology trends — Phrone AI (孚朗AI)</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

    res.set("Content-Type", "application/rss+xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(rss);
  } catch (error) {
    console.error("[RSS] Error generating feed:", error);
    res.status(500).send("Error generating RSS feed");
  }
});

// Chinese RSS feed
rssRouter.get("/api/rss-zh.xml", async (_req, res) => {
  try {
    const articles = await getPublishedArticles(50, 0);
    const categories = await getAllCategories();
    const catMap: Record<string, string> = {};
    categories.forEach((c) => {
      catMap[c.key] = c.nameZh;
    });

    const baseUrl = "https://phrone.ai";
    const now = new Date().toUTCString();

    const items = articles
      .map((a) => {
        const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : now;
        const category = catMap[a.categoryKey] || a.categoryKey;
        return `    <item>
      <title>${escapeXml(a.titleZh)}</title>
      <link>${baseUrl}/article/${a.id}</link>
      <guid isPermaLink="true">${baseUrl}/article/${a.id}</guid>
      <description>${escapeXml(a.excerptZh)}</description>
      <category>${escapeXml(category)}</category>
      <author>${escapeXml(a.author)}</author>
      <pubDate>${pubDate}</pubDate>
      ${a.image ? `<enclosure url="${escapeXml(a.image)}" type="image/png" />` : ""}
    </item>`;
      })
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>孚朗AI (Phrone AI)</title>
    <link>${baseUrl}</link>
    <description>AI行业洞察、研究分析与技术趋势 — 孚朗AI</description>
    <language>zh-cn</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss-zh.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

    res.set("Content-Type", "application/rss+xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(rss);
  } catch (error) {
    console.error("[RSS] Error generating Chinese feed:", error);
    res.status(500).send("Error generating RSS feed");
  }
});

// Sitemap
rssRouter.get("/sitemap.xml", async (_req, res) => {
  try {
    const articles = await getPublishedArticles(200, 0);
    const categories = await getAllCategories();
    const baseUrl = "https://phrone.ai";
    const now = new Date().toISOString();

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/about", priority: "0.8", changefreq: "monthly" },
      { url: "/search", priority: "0.6", changefreq: "weekly" },
    ];

    const urls = [
      ...staticPages.map(
        (p) => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
      ),
      ...categories.map(
        (c) => `  <url>
    <loc>${baseUrl}/category/${c.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
      ),
      ...articles.map(
        (a) => `  <url>
    <loc>${baseUrl}/article/${a.id}</loc>
    <lastmod>${a.updatedAt ? new Date(a.updatedAt).toISOString() : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      ),
    ].join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(sitemap);
  } catch (error) {
    console.error("[Sitemap] Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

export { rssRouter };
