import type { NextFunction, Request, RequestHandler, Response } from "express";

export default function tryCatch(controller: RequestHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
