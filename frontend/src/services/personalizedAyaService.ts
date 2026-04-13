import { api } from "../lib/api";
import type { PersonalizedAya } from "../types/personalizedAya";

export default async function getPersonalizedAya() {
    const { data } = await api.get<PersonalizedAya | null>("/personalized-aya/today");
    return data;
}
