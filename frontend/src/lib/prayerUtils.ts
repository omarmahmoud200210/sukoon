export function convertTimingsToTimestamps(
  timings: Record<string, string>,
  today: Date = new Date(),
): Record<string, number> {
  const timestamps: Record<string, number> = {};

  for (const prayer in timings) {
    const cleanTime = timings[prayer].replace(/\s*\(.*\)$/, "").trim();
    const [hours, minutes] = cleanTime.split(":").map(Number);

    const timestamp = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
    ).getTime();

    timestamps[prayer] = timestamp;
  }

  return timestamps;
}

export function formatTo12Hour(time: string): string {
  const cleanTime = time.replace(/\s*\(.*\)$/, "").trim();
  const [hoursStr, minutes] = cleanTime.split(":");
  let hours = parseInt(hoursStr, 10);

  const period = hours >= 12 ? "PM" : "AM";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours = hours - 12;
  }

  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
}
