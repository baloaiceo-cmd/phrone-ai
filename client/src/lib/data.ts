// Asset URLs
export const ASSETS = {
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663513680832/5R6mPTYvg3rK42ihJNWm4d/phrone-logo-blue_b5c058c8.png",
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663513680832/5R6mPTYvg3rK42ihJNWm4d/hero-main-6ao7AZEh96yJJV4H6AYdi3.webp",
};

// Chart data for Data & Insights section
export const CHART_DATA = [
  { value: 11.2 }, { value: 13.5 }, { value: 12.8 },
  { value: 16.4 }, { value: 18.7 }, { value: 20.1 },
  { value: 22.3 }, { value: 25.8 }, { value: 28.5 },
];

export const CHART_LABELS = {
  zh: ["24Q1", "24Q2", "24Q3", "24Q4", "25Q1", "25Q2", "25Q3", "25Q4", "26Q1"],
  en: ["Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25", "Q1'26"],
};

export function formatDate(dateStr: string | Date | null | undefined, lang: "zh" | "en"): string {
  if (!dateStr) return "";
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  if (lang === "zh") {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
