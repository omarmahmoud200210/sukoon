import z from "zod";
// Schema for New Task
const newTaskSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3).optional(),
});
// Schema for Updating Task
const updateTaskSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(3).optional(),
    completed: z.boolean().optional(),
});
export { newTaskSchema, updateTaskSchema };
