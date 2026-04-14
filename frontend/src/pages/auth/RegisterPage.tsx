import { useState } from "react";
import axios from "axios";
import { Loader2, Globe } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";
import SukoonIcon from "@/components/icons/SukoonIcon";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useForceLightMode } from "../../hooks/useForceLightMode";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, i18n } = useTranslation();

  useForceLightMode();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error(t('auth.fill_all'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('auth.invalid_email', 'Please enter a valid email address'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('auth.password_too_short', 'Password must be at least 6 characters'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('auth.passwords_dont_match'));
      return;
    }

    setLoading(true);
    try {
      await register({
        data: { firstName, lastName, email, password, confirmPassword },
      });
      toast.success(t('auth.account_created'));
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          toast.error(t('auth.rate_limit'));
          setRateLimiting(true);
          setTimeout(() => setRateLimiting(false), 60000);
        } else if (error.response?.status === 401) {
          toast.error(t('auth.user_already_exists', 'This email is already registered. Please login instead.'));
        } else {
          toast.error(t('auth.error'));
        }
      } else {
        toast.error(t('auth.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden transition-all duration-700 font-body">
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
              {t('auth.join_journey')}
            </span>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-on-primary-container font-light mt-3 mb-5">
              {i18n.language === 'ar' ? (
                <>أنشئ <br/> <span className="italic font-normal">ملاذك.</span></>
              ) : (
                <>Create your <br/> <span className="italic font-normal">Sanctuary.</span></>
              )}
            </h1>
            <p className="text-on-primary-container/80 text-sm font-light leading-relaxed max-w-xs">
              {t('auth.signup_desc', 'A digital space designed for your spiritual rhythm and mental clarity.')}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section - Compacted */}
      <section className="w-full lg:w-1/2 bg-surface flex flex-col p-8 md:p-12 justify-center relative">
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
          <header className="mb-8 text-start">
            <h2 className="text-on-background font-display text-3xl font-light mb-2">{t('auth.create_account')}</h2>
            <p className="text-on-surface-variant/70 text-sm font-body">{t('auth.signup_desc')}</p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
               {/* First Name */}
               <div className="relative group text-left">
                <label className="block text-on-surface-variant/40 text-[0.6rem] font-bold tracking-widest mb-1 opacity-30 ps-1 text-start" htmlFor="firstName">
                  {t('auth.first_name')}
                </label>
                <input 
                  className="w-full bg-surface-container-highest/30 border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all duration-300 placeholder-on-surface-variant/20 text-start" 
                  id="firstName" 
                  placeholder={t('auth.first_name')} 
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* Last Name */}
              <div className="relative group text-left">
                <label className="block text-on-surface-variant/40 text-[0.6rem] font-bold tracking-widest mb-1 opacity-30 ps-1 text-start" htmlFor="lastName">
                  {t('auth.last_name')}
                </label>
                <input 
                  className="w-full bg-surface-container-highest/30 border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all duration-300 placeholder-on-surface-variant/20 text-start" 
                  id="lastName" 
                  placeholder={t('auth.last_name')} 
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative group text-left">
              <label className="block text-on-surface-variant/40 text-[0.6rem] font-bold tracking-widest mb-1 opacity-30 ps-1 text-start" htmlFor="email">
                {t('auth.email')}
              </label>
              <input 
                className="w-full bg-surface-container-highest/30 border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all duration-300 placeholder-on-surface-variant/20 text-start" 
                dir="ltr" 
                id="email" 
                placeholder={t('auth.email')} 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Password */}
              <div className="relative group text-left">
                <label className="block text-on-surface-variant/40 text-[0.6rem] font-bold tracking-widest mb-1 opacity-30 ps-1 text-start" htmlFor="password">
                  {t('auth.password')}
                </label>
                <input 
                  className="w-full bg-surface-container-highest/30 border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all duration-300 placeholder-on-surface-variant/20 text-start" 
                  dir="ltr" 
                  id="password" 
                  placeholder={t('auth.password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password */}
              <div className="relative group text-left">
                <label className="block text-on-surface-variant/40 text-[0.6rem] font-bold tracking-widest mb-1 opacity-30 ps-1 text-start" htmlFor="confirmPassword">
                  {t('auth.confirm_password')}
                </label>
                <input 
                  className="w-full bg-surface-container-highest/30 border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary-fixed transition-all duration-300 placeholder-on-surface-variant/20 text-start" 
                  dir="ltr" 
                  id="confirmPassword" 
                  placeholder={t('auth.confirm_password')}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                className="w-full bg-primary text-on-primary rounded-xl h-11 py-2 font-bold text-xs uppercase tracking-widest shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50" 
                type="submit"
                disabled={loading || rateLimiting}
              >
                {loading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <span>{t('auth.create_account')}</span>
                )}
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-outline-variant/10"></div>
              <span className="flex-shrink mx-3 text-outline/30 text-[0.55rem] uppercase font-bold tracking-[0.2em]">{t('auth.or_continue_with')}</span>
              <div className="flex-grow border-t border-outline-variant/10"></div>
            </div>

            <button 
              className="w-full bg-surface-container-low text-on-surface border border-outline-variant/5 rounded-xl h-10 py-2 font-bold text-[0.65rem] uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-surface-container-high transition-colors text-xs" 
              type="button"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>{t('common.google')}</span>
            </button>
          </form>

          <footer className="mt-8 text-center text-sm">
            <p className="text-on-surface-variant/60">
              {t('auth.already_have_account')} 
              <Link className="text-primary font-bold ms-1.5 hover:underline" to="/login">
                {t('auth.sign_in')}
              </Link>
            </p>
          </footer>
        </div>
      </section>

      {/* Grainy overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[100]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA29gfJ23WCKoVnIhKwTtUyV6oEsNY6b5Ic3Ccmu4iULMTH3n7FqtBHC-XTPHvJzmJkdhbM57xkN5kuOoptNHOH4fjQ7-WOStASNO6-qBq_diE8BWuDE8UaMAmlkxp5IgzeGlStl_dibPGR-sdOATagEGI8eITiWuN-GE953Diz3KIO4y1LV3lYfPX95op1O8LHBIwcnAf9TSMq-fEH4R2v1Qz5uRDcJsqGJYwrIudZi3jhaMmgmYy2Pr-57YwEMMvBsMvSmYgwYKwK')" }}></div>
    </div>
  );
}
