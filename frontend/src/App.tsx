import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoutes from "./contexts/auth/ProtectedRoutes";
import AdminRoute from "./contexts/auth/AdminRoute";
import { PrayerProvider } from "./contexts/prayer";
import { AuthRoutes } from "./routes/authRoutes";
import { LandingRoutes } from "./routes/landingRoutes";
import MainLayout from "./pages/layout/MainLayout";
import TafreeghLayout from "./pages/layout/TafreeghLayout";
import TimerLayout from "./pages/layout/TimerLayout";
import AdminLayout from "./pages/layout/AdminLayout";
import TafreeghDashboard from "./pages/tafreegh/TafreeghDashboard";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import TaskDashboard from "./pages/tasks/TaskDashboard";
import TimerDashboard from "./pages/timer/TimerDashboard";
import PrayerDashboard from "./pages/prayer/PrayerDashboard";
import ComingSoon from "./pages/layout/ComingSoon";
import ComingSoonLayout from "@/pages/layout/ComingSoonLayout.tsx";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import OfflineBanner from "./components/OfflineBanner";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSystem from "./pages/admin/AdminSystem";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
      <OfflineBanner />
      <ErrorBoundary>
        <Routes>
          {LandingRoutes}
          {AuthRoutes}
          <Route element={<ProtectedRoutes />}>
            <Route element={<PrayerProvider />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<TaskDashboard />} />
              </Route>

              <Route element={<ComingSoonLayout />}>
                <Route
                  path="/calendar"
                  element={
                    <ComingSoon
                      icon="calendar_month"
                      title={i18n.t("common.calendar")}
                    />
                  }
                />
                <Route
                  path="/habits"
                  element={
                    <ComingSoon
                      icon="auto_awesome"
                      title={i18n.t("common.habits")}
                    />
                  }
                />
                <Route
                  path="/statistics"
                  element={
                    <ComingSoon
                      icon="insights"
                      title={i18n.t("common.statistics")}
                    />
                  }
                />
              </Route>

              <Route element={<TafreeghLayout />}>
                <Route path="/tafreegh" element={<TafreeghDashboard />} />
              </Route>

              <Route element={<TimerLayout />}>
                <Route path="/timer" element={<TimerDashboard />} />
                <Route path="/prayer" element={<PrayerDashboard />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route
                    path="/admin"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/system" element={<AdminSystem />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
