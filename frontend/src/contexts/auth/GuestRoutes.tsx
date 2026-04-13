import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "./useAuth";
import { useTranslation } from "react-i18next";

export default function GuestRoutes() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="size-8 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-display text-sm">
          {t("common.checking_session")}
        </p>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
