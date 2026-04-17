import { Link } from "react-router-dom";
import LandingHeader from "../layout/LandingHeader";
import { useTranslation } from "react-i18next";
import { useForceLightMode } from "../../hooks/useForceLightMode";

export default function About() {
  useForceLightMode();
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden bg-glow transition-all duration-700">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-on-surface mb-6 tracking-tight">
            {t('about_page.hero_title')}{" "}
            <span className="text-primary">
              {t('about_page.hero_brand')}
            </span>
          </h1>
          <p className="text-lg text-on-surface-variant/70 max-w-2xl mx-auto leading-relaxed">
            {t('about_page.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-[1100px] mx-auto px-6 mt-10 pb-24">
        <div className="glass-card rounded-3xl border border-outline-variant/10 overflow-hidden flex flex-col md:flex-row relative editorial-shadow">
          {/* Subtle Corner Glows */}
          <div className="absolute top-0 start-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
          <div className="absolute bottom-0 end-0 w-64 h-64 bg-tertiary/5 rounded-full blur-[80px] -z-10"></div>

          {/* Left Side: Photo/Intro Card */}
          <div className="w-full md:w-1/3 bg-surface-container/40 p-10 border-e border-outline-variant/10 flex flex-col justify-center items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-outline-variant/10 mb-6 editorial-shadow relative">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-tertiary/10 mix-blend-overlay"></div>
              {/* Fallback avatar block */}
              <div className="w-full h-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px]! text-primary/40">code</span>
              </div>
            </div>

            <h2 className="text-2xl font-display font-bold text-on-surface mb-1">Omar Mahmoud</h2>
            <p className="text-primary font-medium text-sm mb-6 uppercase tracking-wider">
              {t('about_page.creator')}
            </p>

            <div className="flex gap-4">
              <Link
                to="https://github.com/omarmahmoud200210"
                target="_blank"
                className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary-fixed flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]! text-on-surface-variant/60">code</span>
              </Link>
            </div>
          </div>

          {/* Right Side: The Story */}
          <div className="w-full md:w-2/3 p-10 md:p-14">
            <h3 className="text-2xl font-display font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]!">terminal</span>
              {t('about_page.journey_title')}
            </h3>
            <p className="text-on-surface-variant/80 leading-relaxed text-lg mb-8">
              {t('about_page.journey_text')}
            </p>

            <h3 className="text-2xl font-display font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]!">lightbulb</span>
              {t('about_page.problem_title')}
            </h3>
            <p className="text-on-surface-variant/80 leading-relaxed text-lg mb-8">
              {t('about_page.problem_text')}
            </p>

            <h3 className="text-2xl font-display font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]!">rocket_launch</span>
              {t('about_page.birth_title')}
            </h3>
            <p className="text-on-surface-variant/80 leading-relaxed text-lg mb-10">
              {t('about_page.birth_text')}
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-container transition-colors"
            >
              {t('about_page.cta')}
              <span className="material-symbols-outlined text-[20px]! rtl:-scale-x-100">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
