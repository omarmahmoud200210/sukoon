import type { Task } from "@/types/tasks";
import { ListTodo } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NoSelectedTask({ task }: { task: Task | null }) {
  const { t } = useTranslation();

  return !task ? (
    <aside className="w-[380px] shrink-0 bg-surface-container-lowest/60 backdrop-blur-3xl flex flex-col h-full border-none shadow-2xl relative z-20 transition-all duration-500">
      <header className="h-24 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <ListTodo className="w-5 h-5 text-primary/40" />
          <h2 className="label-sm">{t("common.task_details")}</h2>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center space-y-4">
        <div className="w-20 h-20 rounded-[32px] bg-surface-container-highest flex items-center justify-center mb-4">
          <ListTodo className="w-8 h-8 text-primary/20" />
        </div>
        <h3 className="text-xl font-semibold text-on-surface">
          {t("common.no_task_selected") || "Quiet Moment"}
        </h3>
        <p className="text-sm text-on-surface-variant/40 leading-relaxed max-w-[240px]">
          {t("common.no_task_selected_desc") || "Select a task to view its details and focus on what matters."}
        </p>
      </div>
    </aside>
  ) : null;
}