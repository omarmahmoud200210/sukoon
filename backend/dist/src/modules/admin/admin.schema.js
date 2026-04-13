import { z } from "zod";
const updateUserRoleSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "ID must be numeric"),
    }),
    body: z.object({
        role: z.enum(["USER", "ADMIN"]),
    }),
});
const updateUserStatusSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "ID must be numeric"),
    }),
    body: z.object({
        isActive: z.boolean(),
    }),
});
const getAllUsersSchema = z.object({
    query: z
        .object({
        role: z.enum(["ADMIN"]).optional(),
        cursor: z.string().regex(/^\d+$/, "Cursor must be numeric").optional(),
        limit: z.string().regex(/^\d+$/, "Limit must be numeric").optional(),
    })
        .optional(),
});
const userIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "ID must be numeric"),
    }),
});
export { updateUserRoleSchema, updateUserStatusSchema, getAllUsersSchema, userIdSchema, };
