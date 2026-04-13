import { z } from "zod";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const createListSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters"),
    color: z
      .string()
      .regex(hexColorRegex, "Color must be a valid hex code (e.g., #FF5733)")
      .optional(),
  }),
});

const updateListSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be numeric"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters")
      .optional(),
    color: z
      .string()
      .regex(hexColorRegex, "Color must be a valid hex code (e.g., #FF5733)")
      .optional(),
  }),
});

export { createListSchema, updateListSchema };
