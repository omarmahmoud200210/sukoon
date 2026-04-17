import LandingHeader from "../layout/LandingHeader";
import { useTranslation } from "react-i18next";
import { useForceLightMode } from "../../hooks/useForceLightMode";

export default function Features() {
  useForceLightMode();
  const { t } = useTranslation();

  const currentFeatures = [
    {
      titleKey: "features_page.feat_grouping_title",
      descKey: "features_page.feat_grouping_desc",
      icon: "grid_view",
    },
    {
      titleKey: "features_page.feat_pomodoro_title",
      descKey: "features_page.feat_pomodoro_desc",
      icon: "timer",
    },
    {
      titleKey: "features_page.feat_tagging_title",
      descKey: "features_page.feat_tagging_desc",
      icon: "sell",
    },
  ];

  const inProgressFeatures = [
    {
      titleKey: "features_page.feat_ai_title",
      descKey: "features_page.feat_ai_desc",
      icon: "psychology",
    },
    {
      titleKey: "features_page.feat_analytics_title",
      descKey: "features_page.feat_analytics_desc",
      icon: "bar_chart",
    },
    {
      titleKey: "features_page.feat_calendar_title",
      descKey: "features_page.feat_calendar_desc",
      icon: "calendar_month",
    },
    {
      titleKey: "features_page.feat_team_title",
      descKey: "features_page.feat_team_desc",
      icon: "group",
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden bg-glow transition-all duration-700">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-on-surface mb-6 tracking-tight">
            {t("features_page.hero_title")}
          </h1>
          <p className="text-lg text-on-surface-variant/70 max-w-2xl mx-auto leading-relaxed">
            {t("features_page.hero_subtitle")}
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-[1100px] mx-auto px-6 relative mt-10 pb-24">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 start-1/2 w-0.5 bg-linear-to-b from-primary/30 via-primary/10 to-transparent -translate-x-1/2 z-0 hidden md:block"></div>

        {/* Current Features */}
        <div className="mb-20 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest">
              <span
                className="material-symbols-outlined text-[16px]!"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              {t("features_page.available_now")}
            </span>
          </div>

          <div className="space-y-12 md:space-y-24">
            {currentFeatures.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="hidden md:block w-5/12"></div>

                {/* Timeline Node */}
                <div className="z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-surface border-4 border-primary editorial-shadow">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>

                {/* Card */}
                <div className="w-full md:w-5/12 glass-card p-6 md:p-8 rounded-3xl border border-primary/20 editorial-shadow relative">
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-2xl! text-primary">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-on-surface mb-3">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-on-surface-variant/80 leading-relaxed text-base">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Features */}
        <div className="relative z-10 mt-32">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface-variant text-sm font-bold uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
              {t("features_page.in_development")}
            </span>
          </div>

          <div className="space-y-12 md:space-y-24">
            <div
              className={`flex flex-col md:flex-row items-center justify-between w-full`}
            >
              <div className="hidden md:block w-5/12"></div>

              {/* Timeline Node */}
              <div className="z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-surface border-2 border-dashed border-tertiary/40">
                <div className="w-2 h-2 bg-tertiary/50 rounded-full"></div>
              </div>

              {/* Card */}
              <div className="w-full md:w-5/12 glass-card p-6 md:p-8 rounded-3xl border border-outline-variant/10 opacity-80 hover:opacity-100 transition-opacity relative">
                <h3 className="text-2xl font-display font-bold text-on-surface mb-3">
                  {t("features_page.feat_upcoming")}
                </h3>
                <p className="text-on-surface-variant/80 leading-relaxed text-base"></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
