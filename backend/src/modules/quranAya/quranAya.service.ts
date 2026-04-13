import QuoteRepository from "./quranAya.repo.js";
import { AppError } from "../../shared/middleware/error.js";
import type { Prisma } from "@prisma/client";
import logger from "../../shared/utils/logger.js";

class QuranAyaService {
  constructor(private quoteRepo: QuoteRepository) {}

  async getTodayQuranAya() {
    return await this.quoteRepo.getTodayQuranAya();
  }

  async getQuranAya(ayaNumber: number): Promise<Prisma.QuranAyaCreateInput> {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${ayaNumber}/ar.alafasy`);

      if (!response.ok) {
        throw AppError.NotFound(`Failed to fetch Quran Aya: ${response.statusText}`);
      }

      const result = await response.json();
      const ayaData = result.data;

      return {
        ayaText: ayaData.text,
        ayaNumber: ayaData.number,
        surahNumber: ayaData.surah.number,
        surahName: ayaData.surah.name,
      };
    } catch (error) {
      logger.error("Error in QuranAyaService.getQuranAya", { error });
      throw error;
    }
  }

  async createQuranAya(aya: Prisma.QuranAyaCreateInput) {
    return await this.quoteRepo.createQuranAya(aya);
  }
}

export default QuranAyaService;
