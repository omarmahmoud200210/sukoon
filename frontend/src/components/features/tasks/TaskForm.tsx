import React from "react";
import type { CreateTask } from "@/types/tasks";

interface TaskFormProps {
  onSubmit: (taskData: CreateTask) => void;
  placeholder?: string;
}

export default function TaskForm({
  onSubmit,
  placeholder = "Add task",
}: TaskFormProps) {

  return (
    <div className="relative group w-full">
      <span className="material-symbols-outlined absolute start-2 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors text-xl!">
        add_circle
      </span>
      <input
        className="w-full ps-12 pe-4 py-2.5 bg-surface-container-highest/30 border border-transparent focus:border-primary/20 focus:bg-surface-container-highest focus:ring-0 rounded-xl text-sm font-body placeholder:text-on-surface-variant/30 transition-all duration-500 editorial-shadow text-start outline-0"
        placeholder={placeholder}
        type="text"
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            onSubmit({ title: e.currentTarget.value });
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
