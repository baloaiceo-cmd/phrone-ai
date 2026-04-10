import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Language = "zh" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Nav
    "nav.home": "首页",
    "nav.aiDaily": "AI日报",
    "nav.deepAnalysis": "深度分析",
    "nav.practicalGuide": "实操指南",
    "nav.industryInsights": "行业洞察",
    "nav.caseStudy": "案例拆解",
    "nav.opinion": "观点",
    "nav.about": "关于我们",
    "nav.subscribe": "订阅",
    "nav.search": "搜索",
    "nav.searchPlaceholder": "搜索文章...",
    "nav.darkMode": "深色模式",
    "nav.lightMode": "浅色模式",

    // Breaking
    "breaking.label": "快讯",
    "breaking.text": "Anthropic 发布 Claude 5 — 首个通过完整图灵测试的AI模型",

    // Hero
    "hero.tag": "编辑推荐",
    "hero.readMore": "阅读全文",
    "hero.minuteRead": "分钟阅读",

    // Sections
    "section.trending": "热门资讯",
    "section.latest": "最新报道",
    "section.deepDive": "深度解读",
    "section.dataInsights": "数据洞察",
    "section.video": "精选视频",
    "section.reports": "行业报告",
    "section.podcast": "最新播客",
    "section.viewAll": "查看全部",
    "section.download": "下载",
    "section.play": "播放",
    "section.featured": "精选",
    "section.categories": "内容分类",
    "section.categories.sub": "六大板块全面覆盖AI生态",

    // Newsletter
    "newsletter.title": "保持领先一步",
    "newsletter.subtitle": "每周精选AI行业最重要的动态，直达您的邮箱。已有超过5万专业人士信赖我们。",
    "newsletter.placeholder": "输入您的邮箱",
    "newsletter.button": "免费订阅",
    "newsletter.privacy": "无垃圾邮件，随时退订。",
    "newsletter.success": "感谢订阅！",
    "newsletter.invalidEmail": "请输入有效的邮箱地址",

    // Categories
    "cat.aiDaily": "AI日报",
    "cat.aiDaily.desc": "每日AI领域最重要的新闻与动态速递",
    "cat.deepAnalysis": "深度分析",
    "cat.deepAnalysis.desc": "深入拆解AI技术架构与行业趋势",
    "cat.practicalGuide": "实操指南",
    "cat.practicalGuide.desc": "框架评测、API指南与最佳实践",
    "cat.industryInsights": "行业洞察",
    "cat.industryInsights.desc": "企业战略、市场格局与商业落地",
    "cat.caseStudy": "案例拆解",
    "cat.caseStudy.desc": "真实AI落地案例的全流程复盘",
    "cat.opinion": "观点",
    "cat.opinion.desc": "行业领袖与专家的独到见解",

    // Deep Dive
    "deepDive.tag": "深度解读",
    "deepDive.category": "地缘政治与科技",
    "deepDive.title": "新「硅幕」：技术脱钩如何重塑全球AI创新格局",
    "deepDive.excerpt": "深入分析中美科技限制如何在AI、芯片和量子计算领域创造平行生态系统，以及这对未来十年创新意味着什么。",
    "deepDive.author": "陈思睿 & David Park",
    "deepDive.readTime": "18分钟阅读",
    "deepDive.readNow": "立即阅读",

    // Data
    "data.title": "全球AI投资趋势",
    "data.subtitle": "AI初创公司季度风险投资额（十亿美元）",
    "data.insight": "2026年Q1，AI初创公司融资额达到285亿美元，同比增长156%，主要由基础模型公司和AI基础设施投资驱动。",
    "data.source": "数据来源：Phrone AI Research, PitchBook",

    // Video
    "video.title": "探秘苹果AR实验室",
    "video.duration": "12:34",
    "video.description": "独家揭秘苹果如何打造下一代计算平台 — 从 Vision Pro 2 到预计2027年推出的轻量级AR眼镜。",

    // Reports
    "reports.r1.title": "2026 AI发展报告",
    "reports.r1.pages": "124页",
    "reports.r2.title": "全球金融科技版图",
    "reports.r2.pages": "86页",
    "reports.r3.title": "2026-2030 电动车市场预测",
    "reports.r3.pages": "98页",

    // Podcast
    "podcast.title": "孚朗AI周刊",
    "podcast.episode": "第142期：为什么每家公司都在变成AI公司",
    "podcast.guest": "嘉宾：李飞飞博士，斯坦福 HAI",
    "podcast.duration": "45 分钟",

    // Footer
    "footer.about": "关于 Phrone AI",
    "footer.aboutText": "Phrone AI（孚朗AI）是专注于人工智能领域的双语科技媒体，致力于为全球读者提供高质量的AI行业分析、深度解读和技术趋势报道。",
    "footer.sections": "栏目",
    "footer.company": "公司",
    "footer.aboutUs": "关于我们",
    "footer.careers": "加入我们",
    "footer.contact": "联系我们",
    "footer.advertise": "商务合作",
    "footer.legal": "法律信息",
    "footer.privacy": "隐私政策",
    "footer.terms": "服务条款",
    "footer.cookies": "Cookie 政策",
    "footer.copyright": "© 2026 Phrone AI 孚朗AI 版权所有",
    "footer.followUs": "关注我们",
    "footer.contactEmail": "hello@phrone.ai",
    "footer.powered": "Powered by OpenClaw",

    // Article
    "article.readTime": "分钟阅读",
    "article.readMore": "阅读全文",
    "article.views": "阅读",
    "article.relatedArticles": "相关文章",
    "article.backToHome": "返回首页",
    "article.share": "分享",

    // Search
    "search.title": "搜索",
    "search.placeholder": "搜索文章、话题...",
    "search.noResults": "未找到相关结果",
    "search.results": "搜索结果",

    // About
    "about.title": "关于 Phrone AI",
    "about.subtitle": "专注人工智能领域的双语科技媒体",
    "about.mission.title": "我们的使命",
    "about.mission.text": "Phrone AI（孚朗AI）致力于成为连接中西方AI生态的桥梁。我们通过高质量的双语内容，帮助全球读者理解AI技术的最新进展、行业动态和政策变化。",
    "about.values.title": "核心价值",
    "about.values.accuracy": "准确",
    "about.values.accuracy.desc": "每篇文章都经过严格的事实核查",
    "about.values.depth": "深度",
    "about.values.depth.desc": "超越表面，深入技术和商业本质",
    "about.values.bilingual": "双语",
    "about.values.bilingual.desc": "中英文同步覆盖，连接全球视野",
    "about.values.independent": "独立",
    "about.values.independent.desc": "独立观点，不受利益驱动",
    "about.coverage.title": "覆盖领域",
    "about.team.title": "团队",
    "about.team.text": "我们的团队由资深科技记者、AI研究员和行业分析师组成，分布在北京、上海、旧金山和伦敦。",
    "about.contact.title": "联系我们",

    // Common
    "common.viewAll": "查看全部",
    "common.loading": "加载中...",
    "common.comingSoon": "功能即将上线",

    // 404
    "notFound.title": "页面未找到",
    "notFound.message": "您访问的页面不存在或已被移除。",
    "notFound.backHome": "返回首页",
  },
  en: {
    // Nav
    "nav.home": "Home",
    "nav.aiDaily": "AI Daily",
    "nav.deepAnalysis": "Deep Analysis",
    "nav.practicalGuide": "Guides",
    "nav.industryInsights": "Industry",
    "nav.caseStudy": "Case Studies",
    "nav.opinion": "Opinion",
    "nav.about": "About",
    "nav.subscribe": "Subscribe",
    "nav.search": "Search",
    "nav.searchPlaceholder": "Search articles...",
    "nav.darkMode": "Dark Mode",
    "nav.lightMode": "Light Mode",

    // Breaking
    "breaking.label": "BREAKING",
    "breaking.text": "Anthropic releases Claude 5 — first AI model to pass complete Turing test",

    // Hero
    "hero.tag": "Editor's Pick",
    "hero.readMore": "Read Full Story",
    "hero.minuteRead": "min read",

    // Sections
    "section.trending": "Trending Now",
    "section.latest": "Latest Stories",
    "section.deepDive": "Deep Dive",
    "section.dataInsights": "Data & Insights",
    "section.video": "Featured Video",
    "section.reports": "Industry Reports",
    "section.podcast": "Latest Podcast",
    "section.viewAll": "View All",
    "section.download": "Download",
    "section.play": "Play",
    "section.featured": "Featured",
    "section.categories": "Categories",
    "section.categories.sub": "Six pillars covering the complete AI ecosystem",

    // Newsletter
    "newsletter.title": "Stay Ahead of the Curve",
    "newsletter.subtitle": "Get the most important AI industry updates delivered to your inbox weekly. Trusted by 50,000+ professionals.",
    "newsletter.placeholder": "Enter your email",
    "newsletter.button": "Subscribe Free",
    "newsletter.privacy": "No spam. Unsubscribe anytime.",
    "newsletter.success": "Thank you for subscribing!",
    "newsletter.invalidEmail": "Please enter a valid email address",

    // Categories
    "cat.aiDaily": "AI Daily",
    "cat.aiDaily.desc": "Daily digest of the most important AI news and updates",
    "cat.deepAnalysis": "Deep Analysis",
    "cat.deepAnalysis.desc": "In-depth breakdowns of AI architectures and industry trends",
    "cat.practicalGuide": "Practical Guides",
    "cat.practicalGuide.desc": "Framework reviews, API guides & best practices",
    "cat.industryInsights": "Industry Insights",
    "cat.industryInsights.desc": "Corporate strategy, market landscape & commercial deployment",
    "cat.caseStudy": "Case Studies",
    "cat.caseStudy.desc": "Full process reviews of real-world AI implementations",
    "cat.opinion": "Opinion",
    "cat.opinion.desc": "Unique perspectives from industry leaders and experts",

    // Deep Dive
    "deepDive.tag": "DEEP DIVE",
    "deepDive.category": "Geopolitics & Tech",
    "deepDive.title": "The New Silicon Curtain: How Tech Decoupling Is Reshaping Global AI Innovation",
    "deepDive.excerpt": "An in-depth analysis of how US-China technology restrictions are creating parallel ecosystems in AI, chips, and quantum computing — and what it means for the next decade of innovation.",
    "deepDive.author": "Sarah Chen & David Park",
    "deepDive.readTime": "18 min read",
    "deepDive.readNow": "Read Now",

    // Data
    "data.title": "Global AI Investment Trends",
    "data.subtitle": "Quarterly venture capital funding in AI startups (Billions USD)",
    "data.insight": "AI startup funding reached $28.5B in Q1 2026, a 156% increase year-over-year, driven primarily by foundation model companies and AI infrastructure plays.",
    "data.source": "Source: Phrone AI Research, PitchBook",

    // Video
    "video.title": "Inside Apple's Secret AR Lab",
    "video.duration": "12:34",
    "video.description": "An exclusive look at how Apple is building the next computing platform — from Vision Pro 2 to lightweight AR glasses arriving in 2027.",

    // Reports
    "reports.r1.title": "State of AI 2026",
    "reports.r1.pages": "124 pages",
    "reports.r2.title": "Global FinTech Landscape",
    "reports.r2.pages": "86 pages",
    "reports.r3.title": "EV Market Forecast 2026-2030",
    "reports.r3.pages": "98 pages",

    // Podcast
    "podcast.title": "The Phrone Weekly",
    "podcast.episode": "Ep. 142: Why Every Company Is Now an AI Company",
    "podcast.guest": "with Dr. Fei-Fei Li, Stanford HAI",
    "podcast.duration": "45 min",

    // Footer
    "footer.about": "About Phrone AI",
    "footer.aboutText": "Phrone AI is a bilingual tech media platform focused on artificial intelligence, delivering high-quality AI industry analysis, deep insights, and technology trend coverage to readers worldwide.",
    "footer.sections": "Sections",
    "footer.company": "Company",
    "footer.aboutUs": "About Us",
    "footer.careers": "Careers",
    "footer.contact": "Contact",
    "footer.advertise": "Advertise",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.cookies": "Cookie Policy",
    "footer.copyright": "© 2026 Phrone AI. All rights reserved.",
    "footer.followUs": "Follow Us",
    "footer.contactEmail": "hello@phrone.ai",
    "footer.powered": "Powered by OpenClaw",

    // Article
    "article.readTime": "min read",
    "article.readMore": "Read More",
    "article.views": "views",
    "article.relatedArticles": "Related Articles",
    "article.backToHome": "Back to Home",
    "article.share": "Share",

    // Search
    "search.title": "Search",
    "search.placeholder": "Search articles, topics...",
    "search.noResults": "No results found",
    "search.results": "Search Results",

    // About
    "about.title": "About Phrone AI",
    "about.subtitle": "Bilingual tech media focused on artificial intelligence",
    "about.mission.title": "Our Mission",
    "about.mission.text": "Phrone AI is dedicated to bridging the AI ecosystems between China and the West. Through high-quality bilingual content, we help global readers understand the latest AI developments, industry dynamics, and policy changes.",
    "about.values.title": "Core Values",
    "about.values.accuracy": "Accuracy",
    "about.values.accuracy.desc": "Every article undergoes rigorous fact-checking",
    "about.values.depth": "Depth",
    "about.values.depth.desc": "Going beyond the surface to the essence of technology and business",
    "about.values.bilingual": "Bilingual",
    "about.values.bilingual.desc": "Simultaneous Chinese-English coverage connecting global perspectives",
    "about.values.independent": "Independent",
    "about.values.independent.desc": "Independent viewpoints, not driven by interests",
    "about.coverage.title": "Coverage Areas",
    "about.team.title": "Our Team",
    "about.team.text": "Our team consists of senior tech journalists, AI researchers, and industry analysts based in Beijing, Shanghai, San Francisco, and London.",
    "about.contact.title": "Contact Us",

    // Common
    "common.viewAll": "View All",
    "common.loading": "Loading...",
    "common.comingSoon": "Coming Soon",

    // 404
    "notFound.title": "Page Not Found",
    "notFound.message": "The page you are looking for does not exist or has been removed.",
    "notFound.backHome": "Back to Home",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("phrone-ai-lang");
      if (saved === "zh" || saved === "en") return saved;
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith("zh") ? "zh" : "en";
    }
    return "zh";
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("phrone-ai-lang", newLang);
    document.documentElement.lang = newLang === "zh" ? "zh-CN" : "en";
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] || key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
