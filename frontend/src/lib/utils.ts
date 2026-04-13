import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (mins: number) => {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${m.toString().padStart(2, "0")}h`;
};

export function formatDateLabel(date: Date, locale: string = "en-US") {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const dateStr = date.toLocaleDateString(locale, options);

  if (date.toDateString() === today.toDateString()) return `Today \u2022 ${dateStr}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday \u2022 ${dateStr}`;

  return `${date.toLocaleDateString(locale, { weekday: "long" })} \u2022 ${dateStr}`;
}

export function formatTimeRange(startStr: string, endStr: string, locale: string = "en-US") {
  if (!startStr || !endStr) return "";
  const start = new Date(startStr);
  const end = new Date(endStr);
  const options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: true };
  return `${start.toLocaleTimeString(locale, options)} - ${end.toLocaleTimeString(locale, options)}`;
}
