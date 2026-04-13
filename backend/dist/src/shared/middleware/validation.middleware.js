import { NextFunction, Request, RequestHandler, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
export const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "Validation Error",
                    errors: error.errors.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
                return; // Ensure we stop execution here
            }
            next(error);
        }
    };
};
