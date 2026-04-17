import { useState } from "react";
import LandingHeader from "../layout/LandingHeader";
import { useTranslation } from "react-i18next";
import { useForceLightMode } from "../../hooks/useForceLightMode";

export default function NewsLetter() {
  useForceLightMode();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { t } = useTranslation();

  const setEmails = new Set<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Temporarily simulating an API call behavior
      setIsSubscribed(true);
      setEmails.add(email);
      setEmail("");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden flex flex-col bg-glow transition-all duration-700">
      <LandingHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 px-6 relative mt-12 md:mt-16 pb-24">
        {/* Background glow effects */}
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-xl w-full text-center glass-card p-8 md:p-14 rounded-3xl border border-outline-variant/10 relative z-10 editorial-shadow">
          <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center mx-auto mb-8 editorial-shadow">
            <span className="material-symbols-outlined text-[32px]! text-primary">
              mail
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-6 tracking-tight">
            {t("newsletter.hero_title")}{" "}
            <span className="text-primary">
              {t("newsletter.hero_highlight")}
            </span>
          </h1>
          <p className="text-lg text-on-surface-variant/70 mb-10 leading-relaxed max-w-md mx-auto">
            {t("newsletter.subtitle")}
          </p>

          {isSubscribed ? (
            <div className="bg-primary-fixed/30 border border-primary/20 text-primary p-6 rounded-2xl flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
              <span
                className="material-symbols-outlined text-[40px]!"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <div>
                <h3 className="text-xl font-display font-bold mb-1">
                  {t("newsletter.subscribed_title")}
                </h3>
                <p className="text-primary/80 text-sm">
                  {t("newsletter.subscribed_desc")}
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.email_placeholder")}
                  className="w-full h-full bg-surface-container-highest/30 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary-fixed transition-all text-on-surface placeholder:text-on-surface-variant/30"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:opacity-90 text-on-primary font-bold px-8 py-4 rounded-xl transition-all editorial-shadow shrink-0 flex items-center justify-center gap-2 group"
              >
                {t("newsletter.subscribe")}
                <span className="material-symbols-outlined text-[18px]! group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                  send
                </span>
              </button>
            </form>
          )}

          <p className="text-on-surface-variant/40 text-xs mt-8">
            {t("newsletter.privacy_note")}
          </p>
        </div>
      </main>
    </div>
  );
}
