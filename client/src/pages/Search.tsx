import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Search as SearchIcon, Clock, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Search() {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState("");

  const { data: results, isLoading } = trpc.articles.search.useQuery(
    { query: query.trim() },
    { enabled: query.trim().length > 0 }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <h1 className="text-3xl font-extrabold text-foreground mb-6">{t("search.title")}</h1>

          <div className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
          </div>

          {query.trim() && (
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    {(results ?? []).length > 0
                      ? `${(results ?? []).length} ${t("search.results")}`
                      : t("search.noResults")}
                  </p>

                  <div className="space-y-0 divide-y divide-border">
                    {(results ?? []).map((article) => {
                      const title = lang === "zh" ? article.titleZh : article.titleEn;
                      const excerpt = lang === "zh" ? article.excerptZh : article.excerptEn;
                      return (
                        <Link
                          key={article.id}
                          href={`/article/${article.id}`}
                          className="group flex gap-4 py-5 first:pt-0"
                        >
                          {article.image && (
                            <div className="hidden sm:block shrink-0 w-32 h-20 rounded-lg overflow-hidden">
                              <img
                                src={article.image}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-xs text-muted-foreground">
                                {t(`cat.${article.categoryKey}`)}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                              {title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {excerpt}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{article.author}</span>
                              <span>{formatDate(article.publishedAt, lang)}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.readTime} {t("article.readTime")}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
