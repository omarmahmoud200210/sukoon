import { Router } from "express";
import PomodoroSessionsRepository from "./pomodoro-sessions.repository.js";
import PomodoroSessionsService from "./pomodoro-sessions.service.js";
import PomodoroSessionsController from "./pomodoro-sessions.controller.js";
import validation from "../../../shared/middleware/validation.js";
import {
  startSessionSchema,
} from "./pomodoro-sessions.schema.js";
import tryCatch from "../../../shared/utils/tryCatch.utils.js";

const pomodoroSessionsRouter = Router();

const pomodoroSessionsRepository = new PomodoroSessionsRepository();
const pomodoroSessionsService = new PomodoroSessionsService(
  pomodoroSessionsRepository,
);
const pomodoroSessionsController = new PomodoroSessionsController(
  pomodoroSessionsService,
);

pomodoroSessionsRouter.post(
  "/start",
  validation(startSessionSchema),
  tryCatch(pomodoroSessionsController.start),
);
pomodoroSessionsRouter.patch(
  "/pause-toggle",
  tryCatch(pomodoroSessionsController.togglePause),
);
pomodoroSessionsRouter.patch(
  "/complete",
  tryCatch(pomodoroSessionsController.complete),
);
pomodoroSessionsRouter.delete(
  "/reset",
  tryCatch(pomodoroSessionsController.reset),
);
pomodoroSessionsRouter.get(
  "/active",
  tryCatch(pomodoroSessionsController.getActive),
);
pomodoroSessionsRouter.get(
  "/stats",
  tryCatch(pomodoroSessionsController.getPomosStats),
);
pomodoroSessionsRouter.get(
  "/task/:taskId/stats",
  tryCatch(pomodoroSessionsController.getTaskStats),
);
pomodoroSessionsRouter.get(
  "/history",
  tryCatch(pomodoroSessionsController.getHistory),
);

pomodoroSessionsRouter.delete(
  "/:sessionId",
  tryCatch(pomodoroSessionsController.delete),
);

pomodoroSessionsRouter.get("/", tryCatch(pomodoroSessionsController.getAll));

export default pomodoroSessionsRouter;
