import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Clock, Loader2 } from "lucide-react";

export default function LatestSection() {
  const { lang, t } = useLanguage();
  const { data: articles, isLoading } = trpc.articles.list.useQuery({ limit: 50, offset: 0 });

  const displayArticles = (articles ?? []).slice(7);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main list */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="section-bar" style={{ backgroundColor: "#7C3AED" }} />
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {t("section.trending")}
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-border">
                {displayArticles.map((article, i) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="group flex gap-4 py-5 first:pt-0"
                  >
                    <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-sm font-bold text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground">
                          {t(`cat.${article.categoryKey}`)}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(article.publishedAt, lang)}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {lang === "zh" ? article.titleZh : article.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lang === "zh" ? article.excerptZh : article.excerptEn}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{article.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime} {t("article.readTime")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Deep Dive highlight */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="section-bar" style={{ backgroundColor: "#DC2626" }} />
                <h2 className="text-xl font-extrabold text-foreground">
                  {t("section.deepDive")}
                </h2>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {t("deepDive.tag")}
                </span>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  {t("deepDive.category")}
                </p>
                <h3 className="text-lg font-bold text-foreground leading-snug mb-3">
                  {t("deepDive.title")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t("deepDive.excerpt")}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t("deepDive.author")}</span>
                  <span className="text-xs text-muted-foreground">{t("deepDive.readTime")}</span>
                </div>
              </div>
            </div>

            {/* Data Insights */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="section-bar" style={{ backgroundColor: "#D97706" }} />
                <h2 className="text-xl font-extrabold text-foreground">
                  {t("section.dataInsights")}
                </h2>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-base font-bold text-foreground mb-2">
                  {t("data.title")}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("data.subtitle")}
                </p>
                {/* Simple bar chart */}
                <div className="flex items-end gap-1.5 h-28 mb-3">
                  {[11.2, 13.5, 12.8, 16.4, 18.7, 20.1, 22.3, 25.8, 28.5].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t transition-all"
                        style={{
                          height: `${(v / 30) * 100}%`,
                          backgroundColor: i === 8 ? "oklch(0.55 0.22 264)" : "oklch(0.55 0.22 264 / 0.25)",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-3">
                  {["Q1'24", "Q2", "Q3", "Q4", "Q1'25", "Q2", "Q3", "Q4", "Q1'26"].map((l, i) => (
                    <span key={i}>{l}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("data.insight")}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-2">
                  {t("data.source")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
