import express from "express";
import logger from "./shared/utils/logger.js";
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./shared/utils/oauth.utils.js";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.route.js";
import checkAuth from "./shared/middleware/auth.js";
import tasksRouter from "./modules/task/tasks/tasks.route.js";
import subTasksRouter from "./modules/task/subtasks/subtasks.route.js";
import listsRouter from "./modules/task/lists/lists.route.js";
import tagsRouter from "./modules/task/tags/tags.route.js";
import pomodoroTasksRouter from "./modules/pomodoro/pomodoro-tasks/pomodoro-tasks.route.js";
import quoteRouter from "./modules/quranAya/quranAya.route.js";
import tafreeghRouter from "./modules/tafreegh/tafreegh.route.js";
import personalizedAyaRouter from "./modules/personalizedAya/personalizedAya.route.js";
import adminRouter from "./modules/admin/admin.route.js";
import {
  personalizedQuranAyaCronJob,
  quranAyaCronJob,
  splittingSessionsCronJob,
} from "./shared/jobs/cron-jobs.js";
import type { Application, Request, Response, NextFunction } from "express";
import { AppError } from "./shared/middleware/error.js";

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    dotenv.config();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeCronJobs();
  }

  initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: "https://localhost:5173",
        credentials: true,
      }),
    );
    this.app.use(helmet());
    this.app.use(passport.initialize());
    this.app.use(morgan("dev"));
  }

  initializeRoutes() {
    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/tasks", checkAuth, tasksRouter);
    this.app.use("/api/v1/lists", checkAuth, listsRouter);
    this.app.use("/api/v1/tags", checkAuth, tagsRouter);
    this.app.use("/api/v1/pomodoro", checkAuth, pomodoroTasksRouter);
    this.app.use("/api/v1/subtasks", checkAuth, subTasksRouter);
    this.app.use("/api/v1/quran-aya", quoteRouter);
    this.app.use("/api/v1/tafreegh", checkAuth, tafreeghRouter);
    this.app.use("/api/v1/personalized-aya", checkAuth, personalizedAyaRouter);
    this.app.use("/api/v1/admin", checkAuth, adminRouter);
    this.initializeErrorHandling();
  }

  initializeErrorHandling() {
    Sentry.setupExpressErrorHandler(this.app);

    this.app.use((_req: Request, _res: Response, next: NextFunction) => {
      next(AppError.NotFound(`Not Found - ${_req.originalUrl}`));
    });

    this.app.use(
      (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        logger.error("Unhandled error", { error: err });
        Sentry.captureException(err);

        if (err instanceof AppError) {
          return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(process.env.NODE_ENV === "development" && {
              stack: err.stack,
            }),
          });
        }

        return res.status(500).json({
          status: "error",
          message:
            process.env.NODE_ENV === "development" && err instanceof Error
              ? err.message
              : "Internal server error",
          ...(process.env.NODE_ENV === "development" &&
            err instanceof Error && { stack: err.stack }),
        });
      },
    );
  }

  initializeCronJobs() {
    splittingSessionsCronJob();
    quranAyaCronJob();

    // Defer async cron job to next tick to avoid blocking startup
    setTimeout(() => {
      personalizedQuranAyaCronJob().catch((err) => {
        logger.error("[CRON] Failed to initialize personalized Quran Aya job", {
          error: err,
        });
      });
    }, 0);
  }
}

export default App;
