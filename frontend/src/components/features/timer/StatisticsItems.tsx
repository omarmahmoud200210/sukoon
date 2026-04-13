import { usePomodoroTaskStatistics } from "@/hooks/useTimer";
import { formatDuration } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StatisticsItems() {
  const { data: statistics, isLoading } = usePomodoroTaskStatistics();
  const { t } = useTranslation();

  const stats = [
    {
      label: t("timer.todaysPomos"),
      value: statistics?.today.count || 0,
    },
    {
      label: t("timer.todaysFocus"),
      value: formatDuration(statistics?.today.duration || 0),
    },
    {
      label: t("timer.totalPomos"),
      value: statistics?.total.count || 0,
    },
    {
      label: t("timer.totalFocus"),
      value: formatDuration(statistics?.total.duration || 0),
    },
  ];

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <Skeleton
            height={12}
            width={60}
            borderRadius={6}
            baseColor="var(--color-surface-container-high)"
            highlightColor="var(--color-surface-container-highest)"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest border border-outline-variant/10 p-4 rounded-xl flex flex-col gap-2 shadow-sm"
            >
              <Skeleton
                height={8}
                width="60%"
                borderRadius={4}
                baseColor="var(--color-surface-container-high)"
                highlightColor="var(--color-surface-container-highest)"
              />
              <Skeleton
                height={24}
                width="50%"
                borderRadius={6}
                baseColor="var(--color-surface-container-high)"
                highlightColor="var(--color-surface-container-highest)"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary/50">{t("timer.overview")}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-surface-container-lowest border border-outline-variant/10 p-4 rounded-xl flex flex-col justify-between shadow-sm hover:border-primary/20 transition-all"
          >
            <span className="text-[9px] font-bold text-secondary/60 uppercase">
              {stat.label}
            </span>
            <div className="text-xl font-black text-primary mt-1">{stat.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
