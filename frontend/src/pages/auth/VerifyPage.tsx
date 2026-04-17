import { useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForceLightMode } from "../../hooks/useForceLightMode";

export default function VerifyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { isLoading, verifyUser } = useAuth();
  const { t } = useTranslation();

  useForceLightMode();

  useEffect(() => {
    if (!token) return;

    verifyUser(token)
      .then(() => {
        toast.success(t("common.email_verified"));
        searchParams.delete("token");
        setSearchParams(searchParams);
      })
      .catch(() => {
        toast.error(t("common.verification_failed"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isLoading) {
    return (
      <div className="bg-background text-on-surface font-display min-h-[100dvh] flex flex-col">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" /> {t("common.verifying_email")}
        </div>
      </div>
    );
  }

  return <Navigate to="/login" />;
}
