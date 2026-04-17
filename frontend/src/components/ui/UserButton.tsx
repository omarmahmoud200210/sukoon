import { useState } from "react";
import { useAuth } from "@/contexts/auth/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import SettingsDialog from "@/components/features/settings/SettingsDialog";

interface UserButtonProps {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export default function UserButton({ side = "right", align = "end", className }: UserButtonProps = {}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const initial = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "U";

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={className || "w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-base font-display font-bold shadow-sm cursor-pointer hover:rotate-3 transition-all duration-500 editorial-shadow outline-none focus-visible:ring-2 focus-visible:ring-primary"}
            title={fullName}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="w-full h-full bg-primary text-on-primary flex items-center justify-center">
                {initial}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={align} side={side} sideOffset={8} className="w-48">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => setSettingsOpen(true)}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            {t("common.settings", "Settings")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            {t("common.logout", "Logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
