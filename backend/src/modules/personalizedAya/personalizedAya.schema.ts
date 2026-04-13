import { z } from "zod";

export const aiAyaResponseSchema = z.object({
    surahName: z.string().min(1, "surahName is required"),
    surahNumber: z.number().int().min(1).max(114, "surahNumber must be between 1 and 114"),
    ayaNumber: z.number().int().min(1, "ayaNumber must be at least 1"),
    ayaText: z.string().min(1, "ayaText is required"),
    reason: z.string().min(1, "reason is required"),
});

export type AiAyaResponse = z.infer<typeof aiAyaResponseSchema>;
