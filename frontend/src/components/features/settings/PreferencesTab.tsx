import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function PreferencesTab() {
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const languages = [
    { code: "en", label: "English", native: "English" },
    { code: "ar", label: "العربية", native: "Arabic" },
  ];

  const themes = [
    {
      value: "light" as const,
      label: t("settings.light", "Light"),
      icon: "light_mode",
    },
    {
      value: "dark" as const,
      label: t("settings.dark", "Dark"),
      icon: "dark_mode",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant/50">
            palette
          </span>
          {t("settings.appearance", "Appearance")}
        </h3>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                theme === t.value
                  ? "bg-primary/10 text-primary border border-primary/30 font-medium"
                  : "bg-surface-container-high/50 text-on-surface-variant/60 border border-outline-variant/10 hover:bg-surface-container-high hover:text-on-surface-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant/10" />

      {/* Language */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant/50">
            language
          </span>
          {t("settings.language", "Language")}
        </h3>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                i18n.language === lang.code
                  ? "bg-primary/10 text-primary border border-primary/30 font-medium"
                  : "bg-surface-container-high/50 text-on-surface-variant/60 border border-outline-variant/10 hover:bg-surface-container-high hover:text-on-surface-variant"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
