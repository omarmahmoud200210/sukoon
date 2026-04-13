import { z } from "zod";

const createTafreeghSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Content is required"),
  }),
});

const updateTafreeghSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be numeric"),
  }),
  body: z.object({
    content: z
      .string()
      .min(1, "Content is required")
  }),
});

export { createTafreeghSchema, updateTafreeghSchema };
