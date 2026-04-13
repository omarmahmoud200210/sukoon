import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useTranslation } from "react-i18next";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-error/90 text-on-error px-4 py-2 text-center text-sm font-medium backdrop-blur-sm">
      <span className="material-symbols-outlined text-[16px] align-middle me-1.5">wifi_off</span>
      {t("common.offline_message")}
    </div>
  );
}
