import { Link } from "react-router-dom";
import { usePrayerContext } from "@/contexts/prayer";
import { useTranslation } from "react-i18next";

export default function PrayerCountdownWidget() {
  const { t } = useTranslation();
  const { nextPrayer, countdown, prayerMessage, isLoading } = usePrayerContext();

  if (isLoading || !nextPrayer || (!countdown && !prayerMessage)) {
    return null;
  }

  return (
    <Link to="/prayer" className="block mb-3">
      <div className="rounded-xl border border-primary/10 bg-primary/5 px-3 py-3 text-center hover:border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-[14px] text-primary">
            mosque
          </span>
          <span className="text-[0.55rem] font-bold uppercase tracking-widest text-secondary/50">
            {prayerMessage ? t("prayer.prayerTime") : t("prayer.nextPrayer")}
          </span>
        </div>
        <p className="text-[11px] font-bold text-primary mb-0.5">
          {t(`prayer.timings.${nextPrayer.name.toLowerCase()}`)}
        </p>
        {prayerMessage ? (
          <p className="text-sm font-bold text-primary animate-pulse">
            {prayerMessage}
          </p>
        ) : (
          <p className="text-base font-mono font-black text-on-surface tabular-nums">
            {String(countdown!.hours).padStart(2, "0")}:
            {String(countdown!.minutes).padStart(2, "0")}:
            {String(countdown!.seconds).padStart(2, "0")}
          </p>
        )}
      </div>
    </Link>
  );
}
