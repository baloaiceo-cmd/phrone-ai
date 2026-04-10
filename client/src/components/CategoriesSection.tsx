import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CategoriesSection() {
  const { lang, t } = useLanguage();
  const { data: categories, isLoading } = trpc.categories.list.useQuery();

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center h-32">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  const cats = categories ?? [];

  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="section-bar bg-primary" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
            {t("section.categories")}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-8 ml-[15px]">
          {t("section.categories.sub")}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((cat) => {
            const name = lang === "zh" ? cat.nameZh : cat.nameEn;
            const desc = lang === "zh" ? (cat.descZh ?? "") : (cat.descEn ?? "");
            return (
              <Link
                key={cat.key}
                href={`/category/${cat.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-[2/1] card-hover"
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div
                    className="w-8 h-1 rounded-full mb-3"
                    style={{ backgroundColor: cat.color ?? "#2563EB" }}
                  />
                  <h3 className="text-lg font-bold text-white mb-1">
                    {name}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-2 mb-2">
                    {desc}
                  </p>
                  <span className="flex items-center gap-1 text-xs font-medium text-white/90 group-hover:text-white transition-colors">
                    {t("section.viewAll")}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
