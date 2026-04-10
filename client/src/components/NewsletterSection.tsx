import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (result) => {
      if (result.alreadySubscribed) {
        toast.info(lang === "zh" ? "您已订阅过了" : "You are already subscribed");
      } else {
        toast.success(t("newsletter.success"));
      }
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error(err.message || (lang === "zh" ? "订阅失败，请重试" : "Subscription failed, please try again"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(t("newsletter.invalidEmail"));
      return;
    }
    subscribeMutation.mutate({ email, language: lang });
  };

  return (
    <section id="newsletter" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 sm:p-12 text-center">
          {submitted ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <h3 className="text-xl font-bold text-foreground">{t("newsletter.success")}</h3>
            </div>
          ) : (
            <>
              <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                {t("newsletter.title")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-6">
                {t("newsletter.subtitle")}
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {subscribeMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("newsletter.button")}
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">{t("newsletter.privacy")}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
