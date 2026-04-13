import QuranAyaService from "./quranAya.service.js";
import type { RequestHandler } from "express";

class QuranAyaController {
  constructor(private quoteService: QuranAyaService) {}

  getTodayQuranAya: RequestHandler = async (_req, res) => {
    const aya = await this.quoteService.getTodayQuranAya();
    return res.status(200).json(aya);
  };
}

export default QuranAyaController;
