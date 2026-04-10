import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Eye, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Article() {
  const { lang, t } = useLanguage();
  const params = useParams<{ id: string }>();
  const articleId = Number(params.id) || 0;

  const { data: article, isLoading } = trpc.articles.byId.useQuery({ id: articleId });

  // Fetch related articles by same category
  const categoryKey = article?.categoryKey ?? "";
  const { data: relatedRaw } = trpc.articles.byCategory.useQuery(
    { categoryKey },
    { enabled: !!categoryKey }
  );
  const relatedArticles = (relatedRaw ?? []).filter(a => a.id !== articleId).slice(0, 3);

  // Fetch category info for breadcrumb
  const { data: categories } = trpc.categories.list.useQuery();
  const category = (categories ?? []).find(c => c.key === categoryKey);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">{t("notFound.title")}</h1>
            <Link href="/" className="text-primary hover:underline">{t("notFound.backHome")}</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = lang === "zh" ? article.titleZh : article.titleEn;
  const excerpt = lang === "zh" ? article.excerptZh : article.excerptEn;
  const content = lang === "zh" ? (article.contentZh ?? excerpt) : (article.contentEn ?? excerpt);
  const paragraphs = content.split("\n\n").filter(Boolean);
  const catName = category ? (lang === "zh" ? category.nameZh : category.nameEn) : t(`cat.${categoryKey}`);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${title} | Phrone AI`}
        description={excerpt}
        image={article.image ?? undefined}
        url={`https://phrone.ai/article/${article.id}`}
        type="article"
        author={article.author}
        publishedTime={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}
        section={catName}
      />
      <Navbar />
      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("nav.home")}
            </Link>
            <span>/</span>
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {catName}
              </Link>
            )}
          </div>

          {/* Article header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-2.5 py-1 rounded text-xs font-semibold text-white"
                style={{ backgroundColor: category?.color ?? "#2563EB" }}
              >
                {catName}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(article.publishedAt, lang)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-4">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {excerpt}
            </p>
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{article.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime} {t("article.readTime")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views.toLocaleString()} {t("article.views")}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success(lang === "zh" ? "链接已复制" : "Link copied");
                }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                {t("article.share")}
              </button>
            </div>
          </div>

          {/* Article image */}
          {article.image && (
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
              <img
                src={article.image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article content */}
          <div className="max-w-none mb-12">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-foreground/85 leading-[1.8] mb-5 text-base">
                {p}
              </p>
            ))}
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-border pt-10">
              <h2 className="text-xl font-extrabold text-foreground mb-6">
                {t("article.relatedArticles")}
              </h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {relatedArticles.map((ra) => {
                  const raTitle = lang === "zh" ? ra.titleZh : ra.titleEn;
                  return (
                    <Link
                      key={ra.id}
                      href={`/article/${ra.id}`}
                      className="group"
                    >
                      {ra.image && (
                        <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3">
                          <img
                            src={ra.image}
                            alt={raTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {raTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(ra.publishedAt, lang)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
