import { useState } from "react";
import { useAuth } from "@/contexts/auth/useAuth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AccountTab() {
  const { changePassword, deleteAccount, logout, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [passwordError, setPasswordError] = useState("");

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleChangePassword = async () => {
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError(t("auth.passwords_dont_match", "Passwords don't match"));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(
        t(
          "settings.password_too_short",
          "Password must be at least 6 characters",
        ),
      );
      return;
    }
    setPasswordStatus("saving");
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordStatus("idle"), 2000);
    } catch {
      setPasswordStatus("error");
      setPasswordError(
        t("settings.password_change_error", "Failed to change password"),
      );
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword);
      await logout();
      navigate("/");
    } catch {
      setDeleteError(
        t(
          "settings.delete_error",
          "Failed to delete account. Check your password.",
        ),
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      {!user?.oauth && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant/50">
              key
            </span>
            {t("settings.change_password", "Change Password")}
          </h3>
          <div className="space-y-2.5">
            <input
              type="password"
              placeholder={t("settings.current_password", "Current password")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-high/50 border border-outline-variant/15 text-on-surface text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="password"
                placeholder={t("auth.new_password", "New password")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-high/50 border border-outline-variant/15 text-on-surface text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"
              />
              <input
                type="password"
                placeholder={t("auth.confirm_password", "Confirm password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-high/50 border border-outline-variant/15 text-on-surface text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-xs text-error">{passwordError}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleChangePassword}
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                passwordStatus === "saving"
              }
              className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all cursor-pointer"
            >
              {passwordStatus === "saving"
                ? t("settings.updating", "Updating...")
                : t("settings.update_password", "Update Password")}
            </button>
            {passwordStatus === "success" && (
              <span className="text-sm text-green-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  check_circle
                </span>
                {t("settings.password_updated", "Password updated")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-outline-variant/10" />

      {/* Delete Account */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-error flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          {t("settings.danger_zone", "Danger Zone")}
        </h3>
        <p className="text-xs text-on-surface-variant/50">
          {t(
            "settings.delete_warning",
            "Deleting your account is permanent. All your data will be lost.",
          )}
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="px-4 py-2 rounded-lg bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-all cursor-pointer">
              {t("settings.delete_account", "Delete Account")}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-surface border-outline-variant/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-on-surface">
                {t("settings.delete_confirm_title", "Are you absolutely sure?")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-on-surface-variant/60">
                {t(
                  "settings.delete_confirm_desc",
                  "This action cannot be undone. Please Enter 'confirm' to continue.",
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <input
              type="text"
              placeholder={t(
                "settings.delete",
                "Please Enter 'confirm' to continue",
              )}
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-high/50 border border-outline-variant/15 text-on-surface text-sm outline-none focus:border-error/50 focus:ring-1 focus:ring-error/20 transition-all placeholder:text-on-surface-variant/30"
            />
            {deleteError && <p className="text-xs text-error">{deleteError}</p>}
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-surface-container-high/50 text-on-surface border-outline-variant/15 hover:bg-surface-container-high">
                {t("common.cancel", "Cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={!deletePassword || isDeleting}
                className="bg-error text-on-error hover:bg-error/90 disabled:opacity-40"
              >
                {isDeleting
                  ? t("settings.deleting", "Deleting...")
                  : t("settings.confirm_delete", "Delete My Account")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
