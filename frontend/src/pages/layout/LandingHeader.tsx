import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth/useAuth";
import { useTranslation } from "react-i18next";
import SukoonIcon from "@/components/icons/SukoonIcon";

export default function LandingHeader() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = (e: React.MouseEvent) => {
    e.preventDefault();
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-outline-variant/10 glass-nav px-6 md:px-20 py-4">
      <div className="flex items-center gap-4 text-on-surface">
        <Link to="/" className="flex items-center gap-4 text-on-surface hover:opacity-90 transition-opacity">
          <SukoonIcon className="size-8 text-primary" />
          <h2 className="text-on-surface text-2xl font-headline font-bold leading-tight tracking-[-0.015em]">
            {t('common.sukoon')}
          </h2>
        </Link>
      </div>

      <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
        <Link to="/features" className="text-on-surface-variant hover:text-primary transition-colors">{t('common.features')}</Link>
        <Link to="/about" className="text-on-surface-variant hover:text-primary transition-colors">{t('common.about')}</Link>
        <Link to="/newsletter" className="text-on-surface-variant hover:text-primary transition-colors">{t('common.newsletter')}</Link>
      </nav>

      <div className="flex justify-end gap-4 md:gap-8">
        {!user && (
          <div className="hidden md:flex items-center gap-9">
            <Link 
              className="text-on-surface-variant/70 text-sm font-medium hover:text-primary transition-colors" 
              to="/login"
            >
              {t('common.login')}
            </Link>
            <Link 
              className="text-on-surface-variant/70 text-sm font-medium hover:text-primary transition-colors" 
              to="/register"
            >
              {t('common.signup')}
            </Link>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant/40 hover:bg-surface-container-high hover:text-primary transition-all cursor-pointer border border-outline-variant/10"
            title={i18n.language === "en" ? "العربية" : "English"}
          >
            <span className="material-symbols-outlined text-[20px]!">language</span>
          </button>

          <Link
            to={user ? "/dashboard" : "/register"}
            className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-xl h-11 px-5 bg-primary text-on-primary text-sm font-bold tracking-wide hover:bg-primary-container transition-all editorial-shadow"
          >
            <span>{user ? t('common.dashboard') : t('landing.start_now')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
