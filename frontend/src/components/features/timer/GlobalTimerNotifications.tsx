import { usePomodoroTasks } from "@/hooks/useTimer";
import useTimerControls from "@/hooks/useTimerControls";
import useNotifications from "@/components/features/timer/notifications";
import { useUIStore } from "@/store/uiStore";

export default function GlobalTimerNotifications() {
  const timerControls = useTimerControls();
  const { data: tasks } = usePomodoroTasks();
  const manualActiveTask = useUIStore((s) => s.manualActiveTask);
  const { activeSession } = timerControls;

  const activeTaskFromSession =
    tasks?.find(
      (t) =>
        String(t.id) === String(activeSession?.pomodoroTaskId) ||
        String(t.id) === String(activeSession?.taskId),
    ) || null;

  const currentActiveTask =
    manualActiveTask !== undefined ? manualActiveTask : activeTaskFromSession;

  useNotifications(currentActiveTask, timerControls);

  return null;
}
