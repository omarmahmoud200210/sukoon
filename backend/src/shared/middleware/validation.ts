import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

const validation = (schema: z.ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          status: "fail",
          errors: err.issues.map((e) => ({
            field: e.path[1],
            message: e.message,
          })),
        });
      }
    }
  };
};

export default validation;
