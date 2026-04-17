import { motion, useReducedMotion } from "framer-motion";
import { pageVariants, getReducedVariants } from "@/lib/animations";
import { usePrayerContext } from "@/contexts/prayer";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PRAYER_ORDER = [
  { key: "Fajr", icon: "wb_twilight" },
  { key: "Sunrise", icon: "wb_sunny" },
  { key: "Dhuhr", icon: "light_mode" },
  { key: "Asr", icon: "wb_sunny" },
  { key: "Maghrib", icon: "nights_stay" },
  { key: "Isha", icon: "bedtime" },
] as const;

export default function PrayerDashboard() {
  const shouldReduce = useReducedMotion();
  const page = getReducedVariants(shouldReduce, pageVariants);
  const { t } = useTranslation();
  const {
    nextPrayer,
    allTimings,
    hijriDate,
    gregorianDate,
    isLoading,
    isError,
    countdown,
    prayerMessage,
    formatTo12Hour,
  } = usePrayerContext();

  return (
    <motion.main
      variants={page}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 flex flex-col bg-background min-w-[360px] transition-colors duration-500 overflow-hidden"
    >
      <div className="flex-1 overflow-hidden p-4 md:pt-8 md:pr-8 md:pb-8 md:pl-0">
        <div className="max-w-[900px] mx-auto h-full overflow-y-auto scrollbar-thin">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-primary">
                {t("prayer.title")}
              </h1>
              {hijriDate && (
                <p className="text-xs text-secondary/60 mt-1">
                  {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} هـ
                  {gregorianDate
                    ? ` — ${gregorianDate.day} ${gregorianDate.month.en} ${gregorianDate.year}`
                    : ""}
                </p>
              )}
            </div>

            {isError && (
              <div className="rounded-xl border border-error/20 bg-error/5 p-4 text-center">
                <p className="text-sm text-error">{t("prayer.error")}</p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col gap-6">
                <div>
                  <Skeleton width={140} height={24} borderRadius={8} />
                  <Skeleton width={220} height={12} borderRadius={6} className="mt-2" />
                </div>

                <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-8 text-center">
                  <Skeleton width={80} height={10} borderRadius={4} className="mx-auto mb-3" />
                  <Skeleton width={100} height={28} borderRadius={8} className="mx-auto mb-2" />
                  <Skeleton width={120} height={16} borderRadius={6} className="mx-auto mb-4" />
                  <Skeleton width={160} height={40} borderRadius={12} className="mx-auto" />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-2 sm:p-4 flex flex-col items-center gap-1 sm:gap-2"
                    >
                      <Skeleton
                        width={28}
                        height={28}
                        borderRadius={8}
                        baseColor="var(--color-surface-container-high)"
                        highlightColor="var(--color-surface-container-highest)"
                      />
                      <Skeleton
                        width={50}
                        height={10}
                        borderRadius={4}
                        baseColor="var(--color-surface-container-high)"
                        highlightColor="var(--color-surface-container-highest)"
                      />
                      <Skeleton
                        width={70}
                        height={20}
                        borderRadius={6}
                        baseColor="var(--color-surface-container-high)"
                        highlightColor="var(--color-surface-container-highest)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && nextPrayer && countdown && (
              <div className="rounded-2xl border border-primary/20 bg-surface-container-lowest p-5 md:p-8 text-center">
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-secondary/60 mb-2">
                  {t("prayer.nextPrayer")}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-primary mb-1">
                  {t(`prayer.timings.${nextPrayer.name.toLowerCase()}`)}
                </h2>
                <p className="text-base md:text-lg font-bold text-on-surface/60 mb-4">
                  {formatTo12Hour(nextPrayer.time)}
                </p>
                <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 md:px-6 md:py-3">
                  <span className="text-xl md:text-2xl font-mono font-black text-primary tabular-nums">
                    {String(countdown.hours).padStart(2, "0")}:
                    {String(countdown.minutes).padStart(2, "0")}:
                    {String(countdown.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            )}

            {!isLoading && prayerMessage && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-3">
                  mosque
                </span>
                <p className="text-xl font-black text-primary">
                  {prayerMessage}
                </p>
              </div>
            )}

            {!isLoading && allTimings && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {PRAYER_ORDER.map(({ key, icon }) => {
                  const isNext = nextPrayer?.name === key;
                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-2 sm:p-4 flex flex-col items-center gap-1 sm:gap-2 transition-colors ${
                        isNext
                          ? "border-primary/30 bg-primary/5"
                          : "border-outline-variant/10 bg-surface-container-lowest"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl sm:text-2xl ${
                          isNext ? "text-primary" : "text-secondary/40"
                        }`}
                      >
                        {icon}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                          isNext ? "text-primary" : "text-secondary/60"
                        }`}
                      >
                        {t(`prayer.timings.${key.toLowerCase()}`)}
                      </span>
                      <span
                        className={`text-sm sm:text-lg font-mono font-bold tabular-nums ${
                          isNext ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {formatTo12Hour(allTimings[key])}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.main>
  );
}
