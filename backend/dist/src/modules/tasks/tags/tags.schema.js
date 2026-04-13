import { z } from "zod";
const createTagSchema = z.object({
    name: z
        .string()
        .min(1, "Tag name is required")
        .max(50, "Tag name must be less than 50 characters"),
});
const updateTagSchema = z.object({
    name: z
        .string()
        .min(1, "Tag name is required")
        .max(50, "Tag name must be less than 50 characters"),
});
export { createTagSchema, updateTagSchema };
