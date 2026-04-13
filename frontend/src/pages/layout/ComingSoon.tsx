import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ComingSoonProps {
  icon?: string;
  title: string;
}

export default function ComingSoon({ icon = "construction", title }: ComingSoonProps) {
  const { t } = useTranslation();
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-background min-h-dvh relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center max-w-md w-full px-6 z-10 text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 editorial-shadow relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full" />
          <span className="material-symbols-outlined text-[40px]! relative z-10">{icon}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight">
          {title}
        </h1>
        
        <p className="text-base text-on-surface-variant/80 font-body mb-8 leading-relaxed max-w-sm">
          {t("common.quietly_building")}
        </p>
        
        <Link 
          to="/dashboard"
          className="h-12 px-6 rounded-xl bg-primary text-on-primary flex items-center gap-3 font-label font-bold tracking-wide hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300"
        >
          <span className="material-symbols-outlined text-[20px]!">arrow_back</span>
          <span>{t("common.return_to_dashboard")}</span>
        </Link>
      </motion.div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-[-1]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA29gfJ23WCKoVnIhKwTtUyV6oEsNY6b5Ic3Ccmu4iULMTH3n7FqtBHC-XTPHvJzmJkdhbM57xkN5kuOoptNHOH4fjQ7-WOStASNO6-qBq_diE8BWuDE8UaMAmlkxp5IgzeGlStl_dibPGR-sdOATagEGI8eITiWuN-GE953Diz3KIO4y1LV3lYfPX95op1O8LHBIwcnAf9TSMq-fEH4R2v1Qz5uRDcJsqGJYwrIudZi3jhaMmgmYy2Pr-57YwEMMvBsMvSmYgwYKwK')" }} />
    </main>
  );
}
