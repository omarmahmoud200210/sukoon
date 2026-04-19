import { useAuth } from "@/contexts/auth/useAuth";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";

export default function ProfileTab() {
  const { user, updateName, updateAvatar } = useAuth();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const hasChanges =
    firstName !== (user?.firstName ?? "") ||
    lastName !== (user?.lastName ?? "");

  const handleSave = async () => {
    if (!hasChanges || !firstName.trim()) return;
    setIsSaving(true);
    setStatus("idle");
    try {
      await updateName(firstName.trim(), lastName.trim());
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus("idle");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await updateAvatar(formData);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5">
      {/* Avatar + Name Preview */}
      <div className="flex items-center gap-4">
        <div className="relative group w-14 h-14 rounded-xl overflow-hidden shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-primary text-on-primary flex items-center justify-center text-xl font-display font-bold">
              {user?.firstName?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )}
          {!user?.oauth && (
            <>
              <div 
                className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="material-symbols-outlined text-white text-[20px]">
                  {isUploading ? "hourglass_empty" : "upload"}
                </span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
            </>
          )}
        </div>
        <div>
          <p className="text-on-surface font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-on-surface-variant/50 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm text-on-surface-variant/70 font-medium">
            {t("auth.first_name", "First Name")}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-container-high/50 border border-outline-variant/15 text-on-surface text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-on-surface-variant/70 font-medium">
            {t("auth.last_name", "Last Name")}
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-container-high/50 border border-outline-variant/15 text-on-surface text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving || !firstName.trim()}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all cursor-pointer"
        >
          {isSaving
            ? t("settings.saving", "Saving...")
            : t("settings.save_changes", "Save Changes")}
        </button>
        {status === "success" && (
          <span className="text-sm text-green-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              check_circle
            </span>
            {t("settings.saved", "Saved")}
          </span>
        )}
        {status === "error" && (
          <span className="text-sm text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {t("settings.save_error", "Failed to save")}
          </span>
        )}
      </div>
    </div>
  );
}
