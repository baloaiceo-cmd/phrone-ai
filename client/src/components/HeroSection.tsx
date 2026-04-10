import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";

export default function HeroSection() {
  const { lang, t } = useLanguage();
  const { data: featured, isLoading } = trpc.articles.featured.useQuery({ limit: 4 });

  if (isLoading || !featured || featured.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  const heroArticle = featured[0];
  const sideArticles = featured.slice(1, 4);

  const getTitle = (a: typeof heroArticle) => lang === "zh" ? a.titleZh : a.titleEn;
  const getExcerpt = (a: typeof heroArticle) => lang === "zh" ? a.excerptZh : a.excerptEn;

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Main lead story */}
          <div className="lg:col-span-3">
            <Link href={`/article/${heroArticle.id}`} className="group block">
              {heroArticle.image && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden mb-5">
                  <img
                    src={heroArticle.image}
                    alt={getTitle(heroArticle)}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 rounded text-xs font-semibold text-white bg-primary">
                  {t("hero.tag")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(heroArticle.publishedAt, lang)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3 text-foreground group-hover:text-primary transition-colors">
                {getTitle(heroArticle)}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {getExcerpt(heroArticle)}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">{heroArticle.author}</span>
                <span className="text-sm text-muted-foreground">
                  {heroArticle.readTime} {t("hero.minuteRead")}
                </span>
              </div>
            </Link>
          </div>

          {/* Side stories */}
          <div className="lg:col-span-2 flex flex-col gap-6 lg:border-l lg:border-border lg:pl-8">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group flex gap-4"
              >
                {article.image && (
                  <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-20 rounded-lg overflow-hidden">
                    <img
                      src={article.image}
                      alt={getTitle(article)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-muted-foreground truncate">
                      {formatDate(article.publishedAt, lang)}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {getTitle(article)}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>·</span>
                    <span>{article.readTime} {t("hero.minuteRead")}</span>
                  </div>
                </div>
              </Link>
            ))}

            <Link
              href="/category/ai-daily"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-auto"
            >
              {t("section.viewAll")}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
