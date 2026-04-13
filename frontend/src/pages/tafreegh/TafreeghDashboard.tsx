import { useTranslation } from "react-i18next";
import { useTafreeghs, useDeleteAllTafreegh, useDeleteTafreegh } from "@/hooks/useTafreegh";
import { usePersonalizedAya } from "@/hooks/usePersonalizedAya";
import ItemActionsMenu from "@/components/ItemActionsMenu";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import TafreeghCardSkeleton from "@/components/features/tafreegh/TafreeghCardSkeleton";
import { PersonalizedAyaCard } from "@/components/features/personalizedAya/PersonalizedAyaCard";
import { toast } from "sonner";
import logger from "@/lib/logger";
import TafreeghModal from "@/components/features/tafreegh/TafreeghModal";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TafreeghItem } from "@/types/tafreegh";
import {
  pageVariants,
  headerVariants,
  gridContainer,
  cardItem,
  getReducedVariants,
} from "@/lib/animations";

export default function TafreeghDashboard() {
  const { t, i18n } = useTranslation();
  const { data: tafreeghData, isLoading } = useTafreeghs();
  const { data: personalizedAya, isLoading: isAyaLoading } = usePersonalizedAya();
  const { mutateAsync: deleteAllTafreegh } = useDeleteAllTafreegh();
  const { mutateAsync: deleteTafreegh } = useDeleteTafreegh();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAyaCardOpen, setIsAyaCardOpen] = useState(false);
  const shouldReduce = useReducedMotion();

  const isRtl = i18n.language === "ar";
  const dateLocale = isRtl ? ar : enUS;
  const activePreviewId = searchParams.get("preview");

  const page = getReducedVariants(shouldReduce, pageVariants);
  const header = getReducedVariants(shouldReduce, headerVariants);
  const grid = getReducedVariants(shouldReduce, gridContainer);
  const card = getReducedVariants(shouldReduce, cardItem);

  const tafreeghList = (tafreeghData || []) as TafreeghItem[];

  const handlePreviewClick = (id: number) => {
    setSearchParams({ preview: String(id) });
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteTafreegh({ id: String(id) });
      toast.success(t("tafreegh.brainDumpDeleted"));
      if (activePreviewId === String(id)) {
        searchParams.delete("preview");
        setSearchParams(searchParams);
      }
    } catch (error) {
      logger.error("Failed to delete tafreegh:", error);
      toast.error(t("tafreegh.failedToDelete"));
    }
  };

  const handleDeleteAll = async () => {
    if (tafreeghList.length === 0) return;
    
    try {
      await deleteAllTafreegh();
      toast.success(t("tafreegh.allBrainDumpsDeleted"));
      searchParams.delete("preview");
      setSearchParams(searchParams);
    } catch (error) {
      logger.error("Failed to delete all tafreeghs:", error);
      toast.error(t("tafreegh.failedToDeleteAll"));
    }
  };

  return (
    <motion.main
      variants={page}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 flex flex-col bg-background min-w-[360px] transition-colors duration-500 overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <motion.header
        variants={header}
        initial="initial"
        animate="animate"
        className="h-20 flex items-center justify-between px-8 relative z-10 bg-background/50 backdrop-blur-md border-b border-outline-variant/10"
      >
        <div className="flex items-baseline gap-4 overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-display font-semibold truncate text-on-surface">
            {t("common.tafreegh") || "Tafreegh"}
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {personalizedAya && (
            <button
              title={t("personalizedAya.yourMessageToday")}
              onClick={() => setIsAyaCardOpen(!isAyaCardOpen)}
              className={`cursor-pointer h-10 px-4 rounded-xl flex items-center gap-2 font-label text-xs font-bold tracking-wider transition-all duration-300 group ${
                isAyaCardOpen
                  ? "bg-primary text-on-primary"
                  : "bg-primary/10 hover:bg-primary text-primary hover:text-on-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]! transition-transform group-hover:scale-110">auto_awesome</span>
              <span className="hidden sm:inline-block">{t("personalizedAya.yourMessageToday")}</span>
            </button>
          )}
          <button 
            title={t("tafreegh.new_tafreegh_title") || "Create New Brain Dump"}
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer h-10 px-4 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-on-primary flex items-center gap-2 font-label text-xs font-bold tracking-wider transition-all duration-300 editorial-shadow group"
          >
            <span className="material-symbols-outlined text-[18px]! transition-transform group-hover:scale-110">add</span>
            <span className="hidden sm:inline-block">{t("tafreegh.newTafreegh")}</span>
          </button>
          { tafreeghList.length > 0 && (
            <ItemActionsMenu
              mode="tafreegh-all"
              onDelete={handleDeleteAll}
            />
          )}
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto">
          {personalizedAya && (
            <PersonalizedAyaCard
              aya={personalizedAya}
              isOpen={isAyaCardOpen}
              onClose={() => setIsAyaCardOpen(false)}
            />
          )}

          {isLoading ? (
            <TafreeghCardSkeleton />
          ) : tafreeghList.length === 0 ? (
            <motion.div
              variants={page}
              initial="initial"
              animate="animate"
              className="flex flex-col items-center justify-center h-64 text-center opacity-50"
            >
              <span className="material-symbols-outlined text-[48px]! mb-4">psychology</span>
              <p className="font-display font-bold text-lg">{t("tafreegh.noBrainDumpsFound")}</p>
              <p className="text-sm font-body mt-2">{t("tafreegh.clickNewTafreegh")}</p>
            </motion.div>
          ) : (
            <motion.div
              variants={grid}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {tafreeghList.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={card}
                    layout
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                    onClick={() => handlePreviewClick(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handlePreviewClick(item.id); }}
                    className={`text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 editorial-shadow ${
                      String(item.id) === activePreviewId
                        ? "bg-primary/5 border-primary shadow-sm shadow-primary/10"
                        : "bg-surface border-outline-variant/20 hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]!">psychology</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant/40">
                          {format(new Date(item.createdAt), "MMM d", { locale: dateLocale })}
                        </span>
                        <ItemActionsMenu
                          mode="tafreegh"
                          onDelete={() => handleDeleteItem(item.id)}
                        />
                      </div>
                    </div>
                    
                    <h3 className="font-display font-bold text-on-surface text-base mb-2 group-hover:text-primary transition-colors">
                      {t("tafreegh.tafreeghItemTitle")}({item.id}) - {format(new Date(item.createdAt), "dd/MM/yyyy")}
                    </h3>
                    
                    <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-[-1]"
        style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA29gfJ23WCKoVnIhKwTtUyV6oEsNY6b5Ic3Ccmu4iULMTH3n7FqtBHC-XTPHvJzmJkdhbM57xkN5kuOoptNHOH4fjQ7-WOStASNO6-qBq_diE8BWuDE8UaMAmlkxp5IgzeGlStl_dibPGR-sdOATagEGI8eITiWuN-GE953Diz3KIO4y1LV3lYfPX95op1O8LHBIwcnAf9TSMq-fEH4R2v1Qz5uRDcJsqGJYwrIudZi3jhaMmgmYy2Pr-57YwEMMvBsMvSmYgwYKwK")` }}
      />
      <TafreeghModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </motion.main>
  );
}
