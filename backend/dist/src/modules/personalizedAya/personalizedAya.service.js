import PersonalizedAyaRepo from "./personalizedAya.repo.js";
import TafreeghRepository from "../tafreegh/tafreegh.repository.js";
import groq from "../../modules/quranAya/ai.config.js";
import QuranAyaService from "../quranAya/quranAya.service.js";
import QuoteRepository from "../quranAya/quranAya.repo.js";
import { personalizedAyaPrompt } from "../../modules/quranAya/ai.config.js";
import { aiAyaResponseSchema } from "./personalizedAya.schema.js";
class PersonalizedAyaService {
    personalizedAya;
    constructor(personalizedAya) {
        this.personalizedAya = personalizedAya;
    }
    async getPersonalizedAya(userId) {
        return await this.personalizedAya.getPersonalizedAya(userId);
    }
    async personalizedAyaWithAI(userId) {
        const allTafreeghs = await new TafreeghRepository().recentTafreeghs(userId);
        if (allTafreeghs.length < 2)
            return;
        const tafreeghEntries = allTafreeghs.map((t) => ({
            date: t.createdAt.toISOString().split("T")[0],
            content: t.content.length > 500 ? t.content.slice(0, 500) + "..." : t.content,
        }));
        if (tafreeghEntries.length === 0)
            return;
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: personalizedAyaPrompt,
                },
                {
                    role: "user",
                    content: JSON.stringify(tafreeghEntries, null, 2),
                },
            ],
        });
        const rawContent = response.choices[0]?.message?.content?.trim();
        if (!rawContent) {
            throw new Error("AI returned empty response");
        }
        const cleanedContent = rawContent
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
        const parsed = JSON.parse(cleanedContent);
        const validated = aiAyaResponseSchema.parse(parsed);
        if (validated) {
            const quranAyaService = new QuranAyaService(new QuoteRepository());
            const ayaFromApi = await quranAyaService.getQuranAya(validated.ayaNumber);
            return this.personalizedAya.createPersonalizedAya(userId, { ...ayaFromApi }, validated.reason);
        }
        return;
    }
}
export default PersonalizedAyaService;
