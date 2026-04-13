import { z } from "zod";
export const createPomodoroTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").max(100, "Title is too long"),
        duration: z
            .number()
            .min(1, "Duration must be at least 1 minute")
            .max(120, "Duration cannot exceed 120 minutes")
            .optional()
            .default(25),
    }),
});
export const updatePomodoroTaskSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "ID must be numeric"),
    }),
    body: z.object({
        title: z.string().min(1).max(100).optional(),
        duration: z.number().min(1).max(120).optional(),
        isArchived: z.boolean().optional(),
    }),
});
