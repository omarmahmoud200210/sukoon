import { z } from "zod";

const createCommentSchema = z.object({
  params: z.object({
    taskId: z.string().regex(/^\d+$/, "Task ID must be numeric"),
  }),
  body: z.object({
    content: z
      .string()
      .min(1, "Content is required")
      .max(1000, "Content must be less than 1000 characters"),
  }),
});

const updateCommentSchema = z.object({
  params: z.object({
    taskId: z.string().regex(/^\d+$/, "Task ID must be numeric"),
    id: z.string().regex(/^\d+$/, "Comment ID must be numeric"),
  }),
  body: z.object({
    content: z
      .string()
      .min(1, "Content is required")
      .max(1000, "Content must be less than 1000 characters"),
  }),
});

export { createCommentSchema, updateCommentSchema };
