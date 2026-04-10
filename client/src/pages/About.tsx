import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Users, Globe, Zap, BookOpen, TrendingUp } from "lucide-react";

const content = {
  zh: {
    title: "关于 Phrone AI",
    subtitle: "孚朗AI — 专注人工智能领域的双语科技媒体",
    mission: {
      title: "我们的使命",
      text: "Phrone AI（孚朗AI）致力于成为连接中西方AI生态的桥梁。我们通过深度报道、数据分析和专家洞察，帮助读者理解人工智能技术的最新进展及其对社会、商业和政策的深远影响。",
    },
    values: [
      { icon: "target", title: "深度优先", desc: "我们不追逐流量，而是专注于有深度、有价值的内容。每篇文章都经过严格的事实核查和专家审阅。" },
      { icon: "globe", title: "双语视角", desc: "中英文双语覆盖，打破信息壁垒。让中文读者了解全球AI前沿，让英文读者洞察中国AI生态。" },
      { icon: "users", title: "社区驱动", desc: "我们相信优质内容来自于社区的力量。欢迎行业专家、研究者和开发者加入我们的内容生态。" },
      { icon: "zap", title: "技术赋能", desc: "运用AI技术辅助内容生产和分发，提高效率的同时保持人类编辑的判断力和创造力。" },
    ],
    coverage: {
      title: "内容覆盖",
      items: [
        { icon: "book", title: "AI日报", desc: "每日精选全球AI领域最重要的新闻和动态" },
        { icon: "trending", title: "深度解析", desc: "对重大技术突破和行业事件的深入分析" },
        { icon: "zap", title: "实用指南", desc: "面向开发者和从业者的工具评测与最佳实践" },
        { icon: "trending", title: "行业洞察", desc: "企业战略、市场格局、商业落地案例" },
        { icon: "target", title: "案例研究", desc: "AI在各行业的实际应用案例和效果分析" },
        { icon: "globe", title: "观点评论", desc: "行业专家和意见领袖的独到见解" },
      ],
    },
    team: {
      title: "团队",
      text: "Phrone AI 由一群热爱AI技术的媒体人、研究者和工程师共同创建。我们的团队分布在北京、上海、旧金山和伦敦，拥有丰富的科技媒体和AI行业经验。",
    },
    contact: {
      title: "联系我们",
      text: "如果您有任何问题、建议或合作意向，请随时联系我们。",
      email: "hello@phrone.ai",
    },
  },
  en: {
    title: "About Phrone AI",
    subtitle: "A bilingual technology media focused on artificial intelligence",
    mission: {
      title: "Our Mission",
      text: "Phrone AI is dedicated to bridging the AI ecosystems between China and the West. Through in-depth reporting, data analysis, and expert insights, we help readers understand the latest developments in AI technology and their profound impact on society, business, and policy.",
    },
    values: [
      { icon: "target", title: "Depth First", desc: "We don't chase traffic. We focus on deep, valuable content. Every article undergoes rigorous fact-checking and expert review." },
      { icon: "globe", title: "Bilingual Perspective", desc: "Chinese-English bilingual coverage breaks down information barriers. We bring global AI frontiers to Chinese readers and Chinese AI insights to English readers." },
      { icon: "users", title: "Community Driven", desc: "We believe great content comes from community power. Industry experts, researchers, and developers are welcome to join our content ecosystem." },
      { icon: "zap", title: "Tech Empowered", desc: "We leverage AI technology to assist content production and distribution, improving efficiency while maintaining human editorial judgment and creativity." },
    ],
    coverage: {
      title: "Coverage Areas",
      items: [
        { icon: "book", title: "AI Daily", desc: "Daily curated news and updates from the global AI landscape" },
        { icon: "trending", title: "Deep Analysis", desc: "In-depth analysis of major tech breakthroughs and industry events" },
        { icon: "zap", title: "Practical Guides", desc: "Tool reviews and best practices for developers and practitioners" },
        { icon: "trending", title: "Industry Insights", desc: "Corporate strategy, market landscape, commercial deployment" },
        { icon: "target", title: "Case Studies", desc: "Real-world AI applications and impact analysis across industries" },
        { icon: "globe", title: "Opinions", desc: "Unique perspectives from industry experts and thought leaders" },
      ],
    },
    team: {
      title: "Our Team",
      text: "Phrone AI was co-founded by a group of media professionals, researchers, and engineers passionate about AI technology. Our team is distributed across Beijing, Shanghai, San Francisco, and London, with extensive experience in tech media and the AI industry.",
    },
    contact: {
      title: "Contact Us",
      text: "If you have any questions, suggestions, or partnership inquiries, please don't hesitate to reach out.",
      email: "hello@phrone.ai",
    },
  },
};

const iconMap: Record<string, React.ReactNode> = {
  target: <Target className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  book: <BookOpen className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
};

export default function About() {
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 sm:py-28 overflow-hidden bg-foreground">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-3xl font-extrabold tracking-tight text-background">PHRONE</span>
              <span className="text-3xl font-extrabold tracking-tight text-background/60">AI</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-background mb-4">{c.title}</h1>
            <p className="text-lg text-background/60 max-w-xl mx-auto">{c.subtitle}</p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-6">{c.mission.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{c.mission.text}</p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 sm:py-20 bg-secondary/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 gap-5">
              {c.values.map((v, i) => (
                <div key={i} className="p-6 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {iconMap[v.icon]}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-10 text-center">{c.coverage.title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {c.coverage.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    {iconMap[item.icon]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 sm:py-20 bg-secondary/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-6">{c.team.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{c.team.text}</p>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">{c.contact.title}</h2>
            <p className="text-muted-foreground mb-6">{c.contact.text}</p>
            <a
              href={`mailto:${c.contact.email}`}
              className="inline-flex px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {c.contact.email}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
