import { useQuery } from "@tanstack/react-query";
import getQuranAya from "@/services/quranAyaService";

export const QURAN_AYA_QUERY_KEY = ["quran-aya", "daily"];

export function useDailyQuranAya() {
  return useQuery({
    queryKey: QURAN_AYA_QUERY_KEY,
    queryFn: getQuranAya,
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
    retry: 2,
  });
}
