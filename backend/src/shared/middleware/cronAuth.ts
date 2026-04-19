import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";
import { AppError } from "./error.js";

export const requireCronSecret = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const querySecret = req.query.secret;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    logger.warn("CRON_SECRET is not defined in environment variables");
    return next(
      AppError.InternalServerError("Cron authentication is not configured"),
    );
  }

  const providedSecret = querySecret;

  if (providedSecret !== cronSecret) {
    logger.warn("Unauthorized attempt to access cron endpoint");
    return next(AppError.Unauthorized("Invalid or missing cron secret"));
  }

  next();
};
