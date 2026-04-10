import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ASSETS } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Search, Menu, X, Sun, Moon, Globe } from "lucide-react";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: categories } = trpc.categories.list.useQuery();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const cats = categories ?? [];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img src={ASSETS.logo} alt="Phrone AI" className="w-8 h-8 rounded-lg" />
            <div className="flex items-center gap-0.5">
              <span className="text-xl font-extrabold tracking-tight text-foreground">PHRONE</span>
              <span className="text-xl font-extrabold tracking-tight text-primary">AI</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {cats.map((cat) => {
              const isActive = location === `/category/${cat.slug}`;
              const name = lang === "zh" ? cat.nameZh : cat.nameEn;
              return (
                <Link
                  key={cat.key}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label={t("nav.search")}
            >
              <Search className="w-[18px] h-[18px]" />
            </Link>

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                aria-label={theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
              >
                {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
            )}

            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === "zh" ? "EN" : "中文"}</span>
            </button>

            <a
              href="#newsletter"
              className="hidden sm:inline-flex px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("nav.subscribe")}
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with slide-in animation */}
      <div
        className={`lg:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ease-in-out ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu panel */}
        <nav
          className={`relative bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out transform ${
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            {cats.map((cat, i) => {
              const name = lang === "zh" ? cat.nameZh : cat.nameEn;
              return (
                <Link
                  key={cat.key}
                  href={`/category/${cat.slug}`}
                  className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                  style={{
                    transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms",
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? "translateX(0)" : "translateX(-8px)",
                  }}
                >
                  {name}
                </Link>
              );
            })}
            <div className="border-t border-border mt-2 pt-2">
              <Link
                href="/about"
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
              >
                {t("nav.about")}
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
