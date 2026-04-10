import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
  section?: string;
}

export default function SEO({
  title = "Phrone AI | 孚朗AI",
  description = "AI industry insights, research analysis, and technology trends — Phrone AI (孚朗AI)",
  image = "https://manus.storage.googleapis.com/phrone-logo-blue.png",
  url,
  type = "website",
  author,
  publishedTime,
  section,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to set or create meta tag
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setNameMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Basic meta
    setNameMeta("description", description);

    // Open Graph
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:image", image);
    setMeta("og:type", type);
    if (url) setMeta("og:url", url);
    setMeta("og:site_name", "Phrone AI");

    // Twitter Card
    setNameMeta("twitter:card", "summary_large_image");
    setNameMeta("twitter:title", title);
    setNameMeta("twitter:description", description);
    setNameMeta("twitter:image", image);

    // Article-specific
    if (type === "article") {
      if (author) setMeta("article:author", author);
      if (publishedTime) setMeta("article:published_time", publishedTime);
      if (section) setMeta("article:section", section);
    }
  }, [title, description, image, url, type, author, publishedTime, section]);

  return null;
}
