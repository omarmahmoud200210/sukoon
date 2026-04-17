import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ProfileTab from "./ProfileTab";
import AccountTab from "./AccountTab";
import PreferencesTab from "./PreferencesTab";

type SettingsTab = "profile" | "account" | "preferences";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: "profile", label: t("settings.profile", "Profile"), icon: "person" },
    { id: "account", label: t("settings.account", "Account"), icon: "lock" },
    {
      id: "preferences",
      label: t("settings.preferences", "Preferences"),
      icon: "tune",
    },
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
          dir="auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-on-surface/30 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[560px] bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/10 flex flex-col max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-6 pt-6 pb-2 relative flex justify-between items-start border-none">
              <div>
                <h2 className="text-on-surface font-display text-lg font-bold">
                  {t("common.settings", "Settings")}
                </h2>
                <p className="text-on-surface-variant/60 text-sm mt-1">
                  {t("settings.description", "Manage your account and preferences")}
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 -mr-2 -mt-2 flex items-center justify-center rounded-lg text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Tab Navigation */}
            <div className="flex gap-1 px-6 pt-2 border-b border-outline-variant/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-t-lg transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary bg-primary/5 font-medium"
                      : "text-on-surface-variant/50 hover:text-on-surface-variant hover:bg-surface-container-high/50"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{
                      fontVariationSettings:
                        activeTab === tab.id ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 min-h-[280px] overflow-y-auto custom-scrollbar">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "account" && <AccountTab />}
              {activeTab === "preferences" && <PreferencesTab />}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
