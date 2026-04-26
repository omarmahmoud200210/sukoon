import { z } from "zod";

// Schema for New Task
const newTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200, "Title too long"),
    description: z.string().max(2000, "Description too long").optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z.string().datetime().optional(),
    listId: z.number().optional(),
    tagIds: z.array(z.number()).optional(),
    position: z.number().optional(),
  }),
});

// Schema for Updating Task
const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be numeric"),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    isCompleted: z.boolean().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z.string().datetime().nullable().optional(),
    tagIds: z.array(z.number()).optional(),
    position: z.number().optional(),
  }),
});

// Schema for Get/Delete by ID
const taskIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be numeric"),
  }),
});

// Schema for List ID
const listIdSchema = z.object({
  params: z.object({
    listId: z.string().regex(/^\d+$/, "List ID must be numeric"),
  }),
  query: z.object({
    status: z.enum(["pending", "completed", "all"]).optional(),
  }).optional(),
});

// Schema for Tag ID
const tagIdSchema = z.object({
  params: z.object({
    tagId: z.string().regex(/^\d+$/, "Tag ID must be numeric"),
  }),
  query: z.object({
    status: z.enum(["pending", "completed", "all"]).optional(),
  }).optional(),
});

export { newTaskSchema, updateTaskSchema, taskIdSchema, listIdSchema, tagIdSchema };
