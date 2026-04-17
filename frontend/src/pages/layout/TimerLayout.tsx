import { Outlet, useLocation } from "react-router-dom";
import UserPanel from "./UserPanel";
import BottomNav from "./BottomNav";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/components/errors/ErrorBoundary";

export default function TimerLayout() {
  const location = useLocation();
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 flex h-[100dvh] overflow-hidden transition-colors duration-500 pb-[calc(68px+env(safe-area-inset-bottom))] md:pb-0">
      <UserPanel />
      <div className="flex-1 flex flex-col overflow-hidden relative shadow-2xl z-0 rounded-none md:rounded-s-[2.5rem] md:-ms-6 bg-background">
        <AnimatePresence mode="wait">
          <ErrorBoundary>
            <Outlet key={location.pathname} />
          </ErrorBoundary>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
