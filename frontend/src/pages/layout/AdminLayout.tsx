import { Outlet, useLocation, NavLink } from "react-router-dom";
import UserPanel from "./UserPanel";
import ErrorBoundary from "@/components/errors/ErrorBoundary";
import { AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { to: "/admin/dashboard", label: "Overview", icon: "dashboard" },
    { to: "/admin/users", label: "Users", icon: "group" },
    { to: "/admin/system", label: "System Health", icon: "monitor_heart" },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 flex h-[100dvh] overflow-hidden transition-colors duration-500 pb-[calc(68px+env(safe-area-inset-bottom))] md:pb-0">
      <UserPanel />

      <aside className="w-60 shrink-0 flex flex-col pt-8 bg-surface/30 backdrop-blur-sm transition-all duration-300 border-e border-outline-variant/10 hidden md:flex relative">
        <div className="px-5 mb-8">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest font-label flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
            Admin Panel
          </h2>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant/70 hover:bg-surface-container-high"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined !text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body text-sm mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative shadow-2xl z-0 rounded-none md:rounded-s-[2.5rem] md:-ms-6 bg-surface p-4 md:p-8">
        <AnimatePresence mode="wait">
          <ErrorBoundary>
            <Outlet key={location.pathname} />
          </ErrorBoundary>
        </AnimatePresence>
      </div>
    </div>
  );
}
