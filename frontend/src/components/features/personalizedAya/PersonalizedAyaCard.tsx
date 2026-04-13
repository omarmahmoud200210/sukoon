import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { PersonalizedAya } from "@/types/personalizedAya";
import { useTranslation } from "react-i18next";

const cardVariants = {
  initial: { opacity: 0, height: 0, marginBottom: 0 },
  animate: { opacity: 1, height: "auto", marginBottom: 24 },
  exit: { opacity: 0, height: 0, marginBottom: 0 },
};

const contentVariants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

interface PersonalizedAyaCardProps {
  aya: PersonalizedAya;
  isOpen: boolean;
  onClose: () => void;
}

export function PersonalizedAyaCard({ aya, isOpen, onClose }: PersonalizedAyaCardProps) {
  const { t, i18n } = useTranslation();
  const shouldReduce = useReducedMotion();
  const isRtl = /[\u0600-\u06FF]/.test(aya.ayaText);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={shouldReduce ? undefined : cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full rounded-2xl bg-surface-container-low/50 border border-primary/20 relative overflow-hidden shadow-sm shadow-primary/5"
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-50" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl opacity-40" />

          <div className="relative px-6 py-5 flex flex-col items-center text-center gap-3">
            <div className="flex items-center gap-2 text-primary/30 select-none">
              <div className="h-px w-4 bg-current" />
              <span className="text-sm leading-none font-display">۞</span>
              <div className="h-px w-4 bg-current" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                variants={shouldReduce ? undefined : contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, delay: 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="max-w-lg">
                  <p
                    className={`text-base md:text-lg font-display text-on-surface leading-relaxed ${isRtl ? "text-right" : "text-left"}`}
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    {aya.ayaText}
                  </p>
                </div>

                {aya.reason && (
                  <div className="max-w-md">
                    <p
                      className={`text-xs md:text-sm font-body text-on-surface-variant/70 italic leading-relaxed ${isRtl ? "text-right" : "text-left"}`}
                      dir={/[\u0600-\u06FF]/.test(aya.reason) ? "rtl" : "ltr"}
                    >
                      {aya.reason}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-medium tracking-tight uppercase text-on-surface-variant/40">
                  <span className="text-primary/60 font-semibold">{aya.surahName}</span>
                  <span className="opacity-20 select-none">•</span>
                  <span className="opacity-30">آية {aya.ayaNumber}</span>
                  <span className="opacity-20 select-none">•</span>
                  <span className="text-primary/50 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]!">auto_awesome</span>
                    {t("personalizedAya.forYou")}
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="mt-1 text-[10px] font-label uppercase tracking-wider text-on-surface-variant/30 hover:text-on-surface-variant/60 transition-colors cursor-pointer"
                >
                  {t("common.close")}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
