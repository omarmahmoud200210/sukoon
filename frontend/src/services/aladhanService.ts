import type {
  PrayerTimesResponse,
  PrayerTimings,
} from "@/types/prayer";
import axios from "axios";

const aladhan = axios.create({
  baseURL: "https://api.aladhan.com/v1",
});

function todayFormatted(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export async function getPrayerTimesByCoords(
  latitude: number,
  longitude: number,
  method = 5,
  school = 0,
): Promise<PrayerTimesResponse> {
  const { data } = await aladhan.get("/timings", {
    params: {
      latitude,
      longitude,
      date: todayFormatted(),
      method,
      school,
    },
  });
  return data.data;
}

export function getNextPrayer(
  timings: PrayerTimings,
): { name: string; time: string } | null {
  
  const prayerOrder = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
  ] as const;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const name of prayerOrder) {
    const [hours, minutes] = timings[name].split(":").map(Number);
    const prayerMinutes = hours * 60 + minutes;

    if (prayerMinutes > currentMinutes) {
      return { name, time: timings[name] };
    }
  }

  return { name: "Fajr", time: timings.Fajr };
}
