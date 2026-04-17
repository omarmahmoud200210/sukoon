import { useState } from "react";
import axios from "axios";
import { Loader2, Globe, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/services/authService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import SukoonIcon from "@/components/icons/SukoonIcon";
import { useForceLightMode } from "../../hooks/useForceLightMode";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(false);
  const { t, i18n } = useTranslation();

  useForceLightMode();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('auth.fill_all'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('auth.invalid_email', 'Please enter a valid email address'));
      return;
    }

    try {
      setLoading(true);
      const forget = await forgotPassword(email);
      if (forget) {
        setIsDisabled(true);
        toast.success(t('auth.forgot_password_success'));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast.error(t('auth.rate_limit'));
        setRateLimiting(true);
        setTimeout(() => setRateLimiting(false), 60000);
      } else if (error instanceof Error) {
        toast.error(error.message);
        setIsDisabled(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex overflow-hidden font-body transition-all duration-700">
      {/* Visual Section - Compacted */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-container items-center justify-center p-12">
        <div className="absolute inset-0 pointer-events-none">
          <img 
            alt="Sanctuary" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2667&auto=format&fit=crop"
          />
        </div>
        <div className="absolute inset-0 bg-primary-container/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-tl from-primary/60 to-transparent"></div>
        
        <div className="relative z-10 max-w-sm text-start">
          <div className="mb-8">
            <span className="text-on-primary-container/70 tracking-[0.15em] font-label text-[0.6rem] uppercase">
              {t('auth.peace_starts_here')}
            </span>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-on-primary-container font-light mt-3 mb-5">
              {i18n.language === 'ar' ? (
                <>استعد <br/> <span className="italic font-normal">توازنك.</span></>
              ) : (
                <>Restore your <br/> <span className="italic font-normal">Balance.</span></>
              )}
            </h1>
            <p className="text-on-primary-container/80 text-sm font-light leading-relaxed max-w-xs">
              {t('auth.forgot_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section - Compacted */}
      <section className="w-full lg:w-1/2 bg-surface flex flex-col p-8 md:p-12 lg:p-16 justify-center relative">
        {/* Header Actions: Logo & Language */}
        <div className="absolute top-10 w-full start-0 px-8 md:px-12 lg:px-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <SukoonIcon className="size-6" />
            <span className="text-on-background font-headline font-semibold text-lg tracking-tight">{t('common.sukoon')}</span>
          </Link>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-on-surface-variant/40 hover:text-primary transition-colors text-[0.65rem] font-bold uppercase tracking-widest"
          >
            <Globe size={14} />
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>

        <div className="max-w-sm w-full mx-auto">
          {/* Back button */}
          <Link
            to="/login"
            className="inline-flex items-center text-[0.6rem] font-bold uppercase tracking-widest text-on-surface-variant/40 hover:text-primary mb-8 transition-colors gap-2 group"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            {t('auth.back_to_login')}
          </Link>

          <header className="mb-8 text-start">
            <h2 className="text-on-background font-display text-3xl font-light mb-2">{t('auth.forgot_title')}</h2>
            <p className="text-on-surface-variant/70 text-sm font-body">{t('auth.forgot_desc')}</p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="relative group text-left">
                <label className="block text-on-surface-variant/40 text-[0.6rem] font-bold tracking-widest mb-1.5 uppercase ps-1 text-start" htmlFor="email">
                  {t('auth.email')}
                </label>
                <input 
                  className="w-full bg-surface-container-highest/30 border-none rounded-xl px-5 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all duration-300 placeholder-on-surface-variant/20 text-start" 
                  dir="ltr" 
                  id="email" 
                  placeholder={t('auth.email')} 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>

            <button 
              className="w-full bg-primary text-on-primary rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 h-12" 
              type="submit"
              disabled={loading || rateLimiting || !email || isDisabled}
            >
              {loading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <>
                  <span>{t('auth.reset_password_btn')}</span>
                  <span className="material-symbols-outlined !text-[18px] rtl:-scale-x-100">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="absolute bottom-8 start-0 w-full px-8 md:px-12 lg:px-16 flex justify-between items-center text-[0.55rem] text-outline/30 uppercase tracking-[0.2em] font-bold">
          <span className="opacity-60">© {new Date().getFullYear()} Sukoon &bull; {t('landing.made_with_peace')}</span>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors" href="#">{t('landing.privacy')}</a>
            <a className="hover:text-primary transition-colors" href="#">{t('landing.terms')}</a>
          </div>
        </div>
      </section>

      {/* Grainy overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[100]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA29gfJ23WCKoVnIhKwTtUyV6oEsNY6b5Ic3Ccmu4iULMTH3n7FqtBHC-XTPHvJzmJkdhbM57xkN5kuOoptNHOH4fjQ7-WOStASNO6-qBq_diE8BWuDE8UaMAmlkxp5IgzeGlStl_dibPGR-sdOATagEGI8eITiWuN-GE953Diz3KIO4y1LV3lYfPX95op1O8LHBIwcnAf9TSMq-fEH4R2v1Qz5uRDcJsqGJYwrIudZi3jhaMmgmYy2Pr-57YwEMMvBsMvSmYgwYKwK')" }}></div>
    </div>
  );
}
