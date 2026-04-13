import { useDailyQuranAya } from "@/hooks/useQuranAya";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function DailyQuranAya() {
  const { data: quranAya, isLoading, isError } = useDailyQuranAya();

  if (isLoading) {
    return (
      <div className="w-full py-3 px-4 mb-4 rounded-xl bg-surface-container-low/30 border border-outline-variant/5 animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <Skeleton
            width={16}
            height={16}
            circle
            baseColor="var(--color-surface-container-high)"
            highlightColor="var(--color-surface-container-highest)"
          />
          <div className="w-full flex flex-col items-center gap-1">
            <Skeleton
              width="40%"
              height={12}
              borderRadius={4}
              baseColor="var(--color-surface-container-high)"
              highlightColor="var(--color-surface-container-highest)"
            />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !quranAya) return null;

  return (
    <div className="w-full py-3.5 px-4 mb-4 rounded-xl bg-surface-container-low/40 border border-outline-variant/10 relative overflow-hidden group transition-all duration-300 hover:bg-surface-container-low/60 animate-fade-in shadow-sm">
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
      
      <div className="relative flex flex-col items-center text-center gap-2.5">
        <div className="flex items-center gap-1.5 text-primary/20 select-none opacity-60">
          <div className="h-px w-3 bg-current" />
          <span className="text-sm leading-none font-display">۞</span>
          <div className="h-px w-3 bg-current" />
        </div>

        <div className="max-w-lg">
          <p 
            className="text-sm md:text-base font-display text-on-surface-variant leading-relaxed group-hover:text-on-surface transition-colors"
            dir={/[\u0600-\u06FF]/.test(quranAya.ayaText) ? "rtl" : "ltr"}
          >
           {quranAya.ayaText}
          </p>
        </div>

        {/* Attribution - Minimalist row */}
        <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-medium tracking-tight uppercase text-on-surface-variant/40">
          <span className="text-primary/60 font-semibold">{quranAya.surahName}</span>
          <span className="opacity-20 select-none">•</span>
          <span className="opacity-30">آية {quranAya.ayaNumber}</span>
        </div>
      </div>
    </div>
  );
}
