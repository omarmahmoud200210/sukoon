import { X } from "lucide-react";
import { createPortal } from "react-dom";
interface SessionEndDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEndAndSave: () => void;
  onQuit: () => void;
  elapsedSecs: number;
  switchLabel?: string;
  onSwitch?: () => void;
  sessionMode: string;
}

export default function SessionEndDialog({
  open,
  onOpenChange,
  onEndAndSave,
  onQuit,
  elapsedSecs,
  switchLabel,
  onSwitch,
  sessionMode,
}: SessionEndDialogProps) {
  if (!open) return null;

  const MIN_SAVE_SECS = 5 * 60;
  const canSave = elapsedSecs >= MIN_SAVE_SECS;
  const elapsedMins = Math.floor(elapsedSecs / 60);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <h2 className="text-lg font-bold font-display text-on-surface">
            End Session
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {(sessionMode === "short_break" || sessionMode === "long_break") ? (
            <>
              <p className="text-sm text-on-surface-variant mb-6">
                Are you sure you want to end your break early?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onQuit();
                    onOpenChange(false);
                  }}
                  className="w-full px-5 py-2 text-sm font-medium text-on-error bg-error hover:bg-error/90 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    delete
                  </span>
                  End Break
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-on-surface-variant">
                {canSave
                  ? `You've focused for ${elapsedMins} min. What would you like to do?`
                  : `You've only focused for ${elapsedMins} min. Sessions under 5 min cannot be saved.`}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {canSave && (
                  <button
                    type="button"
                    onClick={() => {
                      onEndAndSave();
                      onOpenChange(false);
                    }}
                    className="w-full px-5 py-2 text-sm font-medium text-on-primary bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    End and Save
                  </button>
                )}
                {switchLabel && onSwitch && (
                  <button
                    type="button"
                    onClick={() => {
                      onSwitch();
                      onOpenChange(false);
                    }}
                    className="w-full px-5 py-2 text-sm font-medium text-on-tertiary bg-tertiary hover:bg-tertiary/90 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      swap_horiz
                    </span>
                    Switch to "{switchLabel}"
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onQuit();
                    onOpenChange(false);
                  }}
                  className="w-full px-5 py-2 text-sm font-medium text-on-error bg-error hover:bg-error/90 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    delete
                  </span>
                  Quit (delete the session)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
