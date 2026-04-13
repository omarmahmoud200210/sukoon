import { api } from "../lib/api";
import type { QuranAya } from "../types/quranAya";

export default async function getQuranAya() {
    const { data: quranAya } = await api.get<QuranAya>("/quran-aya/today");
    return quranAya;
}