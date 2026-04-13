import QuranAyaService from "./quranAya.service.js";
class QuranAyaController {
    quoteService;
    constructor(quoteService) {
        this.quoteService = quoteService;
    }
    getTodayQuranAya = async (_req, res) => {
        const aya = await this.quoteService.getTodayQuranAya();
        return res.status(200).json(aya);
    };
}
export default QuranAyaController;
