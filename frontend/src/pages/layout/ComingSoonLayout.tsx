import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import UserPanel from "@/pages/layout/UserPanel.tsx";
import ErrorBoundary from "@/components/errors/ErrorBoundary";

export default function ComingSoonLayout() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language === "ar";

  return (
    <div
      className="bg-background text-on-surface font-body selection:bg-primary/30 flex h-[100dvh] overflow-hidden transition-colors duration-500"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <UserPanel />

      <div className="flex-1 flex flex-col overflow-hidden relative shadow-2xl z-0 rounded-s-[2.5rem] -ms-6 bg-background">
        <AnimatePresence mode="wait">
          <ErrorBoundary>
            <Outlet key={location.pathname} />
          </ErrorBoundary>
        </AnimatePresence>
      </div>
    </div>
  );
}
