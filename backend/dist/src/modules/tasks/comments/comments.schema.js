import { z } from "zod";
const createCommentSchema = z.object({
    content: z
        .string()
        .min(1, "Content is required")
        .max(1000, "Content must be less than 1000 characters"),
});
const updateCommentSchema = z.object({
    content: z
        .string()
        .min(1, "Content is required")
        .max(1000, "Content must be less than 1000 characters"),
});
export { createCommentSchema, updateCommentSchema };
