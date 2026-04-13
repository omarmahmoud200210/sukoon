import { motion } from "framer-motion";
import { Coffee, Target, X } from "lucide-react";
import { toast } from "sonner";

interface CustomTimerToastProps {
  id: string | number;
  title: string;
  description: string;
  isBreak: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function CustomTimerToast({
  id,
  title,
  description,
  isBreak,
  action,
}: CustomTimerToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="w-full flex items-start gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-2xl overflow-hidden relative pointer-events-auto"
    >
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          isBreak ? "bg-tertiary" : "bg-primary"
        }`} 
      />

      <div className={`p-2 rounded-lg shrink-0 ${isBreak ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>
        {isBreak ? <Coffee size={20} strokeWidth={2.5} /> : <Target size={20} strokeWidth={2.5} />}
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-sm font-bold text-on-surface mb-0.5">{title}</h4>
        <p className="text-xs font-medium text-secondary/70 mb-3">{description}</p>
        
        {action && (
          <button
            onClick={() => {
              action.onClick();
              toast.dismiss(id);
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
              isBreak
                ? "bg-tertiary text-on-tertiary hover:bg-tertiary/90"
                : "bg-primary text-on-primary hover:bg-primary/90"
            }`}
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => toast.dismiss(id)}
        className="absolute top-3 right-3 p-1.5 text-secondary/40 hover:text-secondary hover:bg-secondary/10 rounded-full transition-colors cursor-pointer"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}
