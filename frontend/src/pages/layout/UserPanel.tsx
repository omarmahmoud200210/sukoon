import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserButton from "@/components/ui/UserButton";
import { useAuth } from "@/contexts/auth/useAuth";

export default function UserPanel() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();
  const { user } = useAuth();

  const navLinks = [
    { to: "/dashboard", icon: "task_alt", label: t("common.tasks") },
    { to: "/timer", icon: "timer", label: t("common.focus") },
    { to: "/prayer", icon: "mosque", label: t("common.prayer") },
    { to: "/tafreegh", icon: "psychology", label: t("common.tafreegh") },
    { to: "/calendar", icon: "calendar_month", label: t("common.calendar") },
    { to: "/habits", icon: "auto_awesome", label: t("common.habits") },
    { to: "/statistics", icon: "insights", label: t("common.statistics") },
  ];

  if (user?.role === "ADMIN") {
    navLinks.push({ to: "/admin/dashboard", icon: "admin_panel_settings", label: "Admin Panel" });
  }

  return (
    <aside className="w-16 shrink-0 hidden md:flex flex-col items-center py-8 bg-surface/50 backdrop-blur-md border-e border-outline-variant/10 relative z-10 transition-all duration-500">
      <div className="mb-8">
        <UserButton />
      </div>

      <nav className="flex-1 flex flex-col gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            title={link.label}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
              currentPath === link.to
                ? "bg-primary-container/30 text-primary"
                : "text-on-surface-variant/40 hover:bg-surface-container-high hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings:
                  currentPath === link.to ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {link.icon}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
