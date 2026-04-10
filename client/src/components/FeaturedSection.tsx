import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, Clock, Eye, Loader2 } from "lucide-react";

export default function FeaturedSection() {
  const { lang, t } = useLanguage();
  const { data: articles, isLoading } = trpc.articles.list.useQuery({ limit: 8, offset: 0 });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center h-32">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  const displayArticles = (articles ?? []).slice(3, 7);
  if (displayArticles.length === 0) return null;

  const getTitle = (a: (typeof displayArticles)[0]) => lang === "zh" ? a.titleZh : a.titleEn;
  const getExcerpt = (a: (typeof displayArticles)[0]) => lang === "zh" ? a.excerptZh : a.excerptEn;
  const getCatName = (a: (typeof displayArticles)[0]) => t(`cat.${a.categoryKey}`);

  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="section-bar bg-primary" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {t("section.latest")}
            </h2>
          </div>
          <Link
            href="/category/ai-daily"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {t("section.viewAll")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Article grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayArticles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
            >
              {article.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image}
                    alt={getTitle(article)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {getCatName(article)}
                  </span>
                </div>
                <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {getTitle(article)}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {getExcerpt(article)}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(article.publishedAt, lang)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}{lang === "zh" ? "分钟" : "min"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {(article.views / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
