import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LandingHeader from "../layout/LandingHeader";
import Footer from "../layout/Footer";
import { useForceLightMode } from "../../hooks/useForceLightMode";

export default function LandingPage() {
  useForceLightMode();
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed font-body transition-all duration-700 bg-glow overflow-x-hidden`}>
      <LandingHeader />

      <main className="flex-1">
        {/* Compact Hero Section */}
        <div className="max-w-[1100px] mx-auto px-6 py-8 md:py-16">
          <div className="flex flex-col gap-10 lg:flex-row items-center">
            <div className="flex flex-col gap-6 flex-1 text-start order-2 lg:order-1">
              <div className="flex flex-col gap-4">
                <h1 className="text-on-surface text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.15] tracking-tight">
                  {t('landing.hero_title')}
                </h1>
                <p className="text-on-surface-variant/80 text-base md:text-lg font-normal leading-relaxed max-w-[500px]">
                  {t('landing.hero_subtitle')}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link 
                  to="/register" 
                  className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary text-on-primary text-base font-bold hover:scale-[1.02] transition-transform editorial-shadow"
                >
                  <span>{t('landing.start_focusing')}</span>
                </Link>
                <Link 
                  to="/features" 
                  className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 border border-outline-variant/20 text-primary text-base font-medium hover:bg-surface-container-low transition-colors"
                >
                  <span>{t('landing.explore_more')}</span>
                </Link>
              </div>
            </div>
            
            <div className="w-full flex-1 order-1 lg:order-2">
              <div className="relative w-full aspect-square lg:aspect-4/3 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px]"></div>

                <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-surface rounded-3xl p-6 editorial-shadow border border-outline-variant/10 group hover:scale-105 transition-transform duration-500">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-[6px] border-primary/20 flex items-center justify-center relative">
                      <div className="absolute inset-[-6px] rounded-full border-[6px] border-primary border-t-transparent animate-spin-slow"></div>
                      <span className="material-symbols-outlined text-primary text-3xl!">timer</span>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-on-surface-variant/60 tracking-widest uppercase mb-1">{t('landing.focus_session')}</div>
                      <div className="text-5xl font-display font-bold text-on-surface tracking-tight">25:00</div>
                    </div>
                  </div>
                </div>

                <div className="absolute z-10 top-[5%] md:top-[10%] left-0 md:left-[10%] lg:-left-[5%] w-48 bg-surface-container-lowest rounded-2xl p-4 editorial-shadow border border-outline-variant/10 opacity-90 hover:opacity-100 transition-opacity hover:-translate-y-2 duration-500">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-secondary text-[16px]!">task_alt</span>
                    <span className="text-xs font-bold text-on-surface">{t('landing.feature_tasks')}</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2 opacity-50">
                      <div className="w-3.5 h-3.5 rounded-sm bg-secondary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[10px]!">check</span></div>
                      <div className="h-2 flex-1 bg-outline-variant/20 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-sm border-2 border-outline-variant/40"></div>
                      <div className="h-2 flex-1 bg-outline-variant/40 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-sm border-2 border-outline-variant/40"></div>
                      <div className="h-2 w-2/3 bg-outline-variant/30 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute z-10 bottom-[5%] md:bottom-[10%] right-0 md:right-[10%] lg:-right-[5%] w-56 bg-surface-container-lowest rounded-2xl p-4 editorial-shadow border border-outline-variant/10 opacity-90 hover:opacity-100 transition-opacity flex flex-col gap-3 hover:-translate-y-2 duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[16px]!">psychology</span>
                      <span className="text-xs font-bold text-on-surface">{t('landing.feature_tafreegh')}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-[14px]!">edit_note</span>
                  </div>
                  <div className="bg-surface-container/50 rounded-xl p-3.5">
                    <div className="h-1.5 w-full bg-outline-variant/30 rounded-full mb-2.5"></div>
                    <div className="h-1.5 w-4/5 bg-outline-variant/30 rounded-full mb-2.5"></div>
                    <div className="h-1.5 w-2/3 bg-outline-variant/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Features Section */}
        <section className="bg-surface-container-low py-16 md:py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="flex flex-col gap-3 mb-12 text-start lg:text-center">
              <h2 className="text-on-surface text-3xl font-display font-bold">{t('landing.features_title')}</h2>
              <p className="text-on-surface-variant/70 text-base max-w-[600px] mx-auto">{t('landing.features_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pomodoro */}
              <div className="group flex flex-col gap-5 rounded-3xl bg-surface p-8 transition-all hover:bg-surface-container-highest editorial-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-primary group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl!">timer</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-on-surface text-xl font-display font-bold">{t('landing.feature_pomodoro')}</h3>
                  <p className="text-on-surface-variant/80 leading-relaxed text-sm">
                    {t('landing.feature_pomodoro_desc')}
                  </p>
                </div>
              </div>
              {/* Tasks */}
              <div className="group flex flex-col gap-5 rounded-3xl bg-surface p-8 transition-all hover:bg-surface-container-highest editorial-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-secondary group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl!">task_alt</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-on-surface text-xl font-display font-bold">{t('landing.feature_tasks')}</h3>
                  <p className="text-on-surface-variant/80 leading-relaxed text-sm">
                    {t('landing.feature_tasks_desc')}
                  </p>
                </div>
              </div>
              {/* Tafreegh */}
              <div className="group flex flex-col gap-5 rounded-3xl bg-surface p-8 transition-all hover:bg-surface-container-highest editorial-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary-fixed text-tertiary group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl!">psychology</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-on-surface text-xl font-display font-bold">{t('landing.feature_tafreegh')}</h3>
                  <p className="text-on-surface-variant/80 leading-relaxed text-sm">
                    {t('landing.feature_tafreegh_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compact Quote Section */}
        <section className="py-16 md:py-20 max-w-[1100px] mx-auto px-6 text-center">
          <div className="bg-primary p-10 md:p-16 rounded-4xl text-on-primary relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-6">
              <span className="material-symbols-outlined text-4xl! opacity-40">format_quote</span>
              <h2 className="text-2xl md:text-4xl font-display font-light italic leading-tight max-w-[700px]">
                {t('landing.quote')}
              </h2>
              <div className="h-px w-16 bg-on-primary/20"></div>
              <p className="text-primary-fixed/80 text-base font-display uppercase tracking-widest">{t('landing.join_community')}</p>
            </div>
            <div className="absolute top-0 end-0 w-48 h-48 bg-primary-container/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 start-0 w-48 h-48 bg-tertiary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Grainy overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-100" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA29gfJ23WCKoVnIhKwTtUyV6oEsNY6b5Ic3Ccmu4iULMTH3n7FqtBHC-XTPHvJzmJkdhbM57xkN5kuOoptNHOH4fjQ7-WOStASNO6-qBq_diE8BWuDE8UaMAmlkxp5IgzeGlStl_dibPGR-sdOATagEGI8eITiWuN-GE953Diz3KIO4y1LV3lYfPX95op1O8LHBIwcnAf9TSMq-fEH4R2v1Qz5uRDcJsqGJYwrIudZi3jhaMmgmYy2Pr-57YwEMMvBsMvSmYgwYKwK')" }}></div>
    </div>
  );
}
