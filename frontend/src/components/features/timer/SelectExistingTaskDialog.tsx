import { usePomodoroAvailableTasks } from "@/hooks/useTimer";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";

interface SelectExistingTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (task: any) => void;
}

export default function SelectExistingTaskDialog({
  isOpen,
  onClose,
  onSelect,
}: SelectExistingTaskDialogProps) {
  const { t } = useTranslation();
  const { data: availableTasks, isLoading } = usePomodoroAvailableTasks();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = availableTasks?.filter((task: any) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-surface text-on-surface p-0 gap-0 overflow-hidden border border-outline-variant/20 shadow-xl rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-outline-variant/10">
          <DialogTitle className="text-xl font-bold font-body">
            {t("timer.selectExistingTask") || "Select Existing Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b border-outline-variant/10 bg-surface-container-lowest/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder={t("common.search") || "Search tasks..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-container-highest/20 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/40"
            />
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
          <div className="p-2 flex flex-col gap-1">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-on-surface-variant/50">
                {t("common.loading") || "Loading..."}
              </div>
            ) : filteredTasks?.length === 0 ? (
              <div className="p-8 text-center text-sm text-on-surface-variant/50 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl opacity-50">
                  search_off
                </span>
                <p>{t("common.noResults") || "No tasks found"}</p>
              </div>
            ) : (
              filteredTasks?.map((task: any) => (
                <button
                  key={task.id}
                  onClick={() => {
                    onSelect(task);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-highest/30 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex flex-col gap-1 min-w-0 pr-4">
                    <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/60 font-medium">
                      {task.priority === "HIGH" && (
                        <span className="text-error bg-error/10 px-1.5 py-0.5 rounded-sm">HIGH</span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]!">calendar_today</span>
                          {format(new Date(task.dueDate), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 w-6 h-6 rounded-full border border-outline-variant/30 group-hover:border-primary flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 text-primary transition-opacity">
                      add
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
