export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface HijriDate {
  date: string;
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
  holidays: string[];
}

export interface GregorianDate {
  date: string;
  day: string;
  month: { number: number; en: string };
  year: string;
}

export interface PrayerTimesResponse {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: HijriDate;
    gregorian: GregorianDate;
  };
  meta: {
    method: { id: number; name: string };
    school: string;
  };
}

export interface NextPrayerResponse {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: HijriDate;
    gregorian: GregorianDate;
  };
  meta: {
    method: { id: number; name: string };
    school: string;
  };
}

export interface PrayerTimesByCityParams {
  city: string;
  country: string;
  date?: string;
  method?: number;
  school?: number;
}