import { useQuery } from "@tanstack/react-query";
import getPersonalizedAya from "@/services/personalizedAyaService";

export const PERSONALIZED_AYA_QUERY_KEY = ["personalized-aya", "today"];

export function usePersonalizedAya() {
  return useQuery({
    queryKey: PERSONALIZED_AYA_QUERY_KEY,
    queryFn: getPersonalizedAya,
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
    retry: 1,
  });
}
