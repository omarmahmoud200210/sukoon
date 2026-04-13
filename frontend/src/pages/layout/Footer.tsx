import { useTranslation } from "react-i18next";
import SukoonIcon from "@/components/icons/SukoonIcon";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col gap-10 px-6 py-16 bg-surface text-center border-t border-outline-variant/5">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-2.5 text-primary">
          <SukoonIcon className="size-5" />
          <span className="text-lg font-display font-bold text-on-surface tracking-tight">
            {t("common.sukoon")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-outline/30 text-[9px] font-bold uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Sukoon &bull;{" "}
          {t("landing.made_with_peace")}
        </p>
      </div>
    </footer>
  );
}
