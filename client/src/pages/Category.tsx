import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Eye, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Category() {
  const { lang, t } = useLanguage();
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: category, isLoading: catLoading } = trpc.categories.bySlug.useQuery({ slug });
  const categoryKey = category?.key ?? "";
  const { data: articles, isLoading: artLoading } = trpc.articles.byCategory.useQuery(
    { categoryKey },
    { enabled: !!categoryKey }
  );

  const isLoading = catLoading || artLoading;
  const catName = category ? (lang === "zh" ? category.nameZh : category.nameEn) : "";
  const catDesc = category ? (lang === "zh" ? (category.descZh ?? "") : (category.descEn ?? "")) : "";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{catName || slug}</span>
          </div>

          {catLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !category ? (
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-foreground mb-4">{t("notFound.title")}</h1>
              <Link href="/" className="text-primary hover:underline flex items-center gap-1 justify-center">
                <ArrowLeft className="w-4 h-4" />
                {t("notFound.backHome")}
              </Link>
            </div>
          ) : (
            <>
              {/* Category header */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: category.color ?? "#2563EB" }}
                  />
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    {catName}
                  </h1>
                </div>
                {catDesc && (
                  <p className="text-muted-foreground ml-[16px]">{catDesc}</p>
                )}
              </div>

              {/* Articles grid */}
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : (articles ?? []).length === 0 ? (
                <p className="text-muted-foreground text-center py-20">{t("search.noResults")}</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(articles ?? []).map((article) => {
                    const title = lang === "zh" ? article.titleZh : article.titleEn;
                    const excerpt = lang === "zh" ? article.excerptZh : article.excerptEn;
                    return (
                      <Link
                        key={article.id}
                        href={`/article/${article.id}`}
                        className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
                      >
                        {article.image && (
                          <div className="aspect-[16/10] overflow-hidden">
                            <img
                              src={article.image}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-medium">{article.author}</span>
                            <span>{formatDate(article.publishedAt, lang)}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime} {t("article.readTime")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {(article.views / 1000).toFixed(1)}k
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
