import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserButton from "@/components/ui/UserButton";

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const navLinks = [
    { to: "/dashboard", icon: "task_alt", label: t("common.tasks") },
    { to: "/timer", icon: "timer", label: t("common.focus") },
    { to: "/prayer", icon: "mosque", label: t("common.prayer") },
    { to: "/tafreegh", icon: "psychology", label: t("common.tafreegh") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 min-h-[68px] bg-background/90 backdrop-blur-lg border-t border-outline-variant/10 z-60 flex md:hidden items-center justify-around px-2 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] box-border">
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          title={link.label}
          className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${
            currentPath === link.to
              ? "text-primary"
              : "text-on-surface-variant/40 hover:text-primary"
          }`}
        >
          <div className={`flex items-center justify-center w-12 h-8 rounded-full mb-1 transition-all ${currentPath === link.to ? "bg-primary-container/50" : ""}`}>
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings:
                  currentPath === link.to ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {link.icon}
            </span>
          </div>
          <span className="text-[10px] font-medium leading-none truncate max-w-full px-1">{link.label}</span>
        </Link>
      ))}
      <div className="flex flex-col items-center justify-center w-16 h-full">
         <div className="flex items-center justify-center h-8 mb-2">
            <UserButton 
              side="top" 
              align="center" 
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-sm font-display font-bold shadow-sm cursor-pointer hover:scale-105 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
         </div>
         <span className="text-[10px] font-medium leading-none text-on-surface-variant/40">{t("common.profile") || "Profile"}</span>
      </div>
    </nav>
  );
}
