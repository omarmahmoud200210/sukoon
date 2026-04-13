import { z } from "zod";
export const startSessionSchema = z.object({
    body: z.object({
        taskId: z.number().optional(),
        pomodoroTaskId: z.number().optional(),
        duration: z
            .number()
            .min(1, "Duration must be at least 1 minute")
            .max(120, "Duration cannot exceed 120 minutes"),
        sessionCount: z.number().optional(),
    })
});
