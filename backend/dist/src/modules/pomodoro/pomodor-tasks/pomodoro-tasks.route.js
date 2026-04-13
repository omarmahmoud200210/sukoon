import { Router } from "express";
import PomodoroTaskRepository from "./pomodoro-tasks.repository.js";
import PomodoroTaskService from "./pomodoro-tasks.service.js";
import PomodoroTasksController from "./pomodoro-tasks.controller.js";
import validation from "../../shared/middleware/validation.js";
import { createPomodoroTaskSchema, updatePomodoroTaskSchema, } from "./pomodoro-tasks.schema.js";
import tryCatch from "../../shared/utils/tryCatch.utils.js";
import pomodoroSessionsRouter from "./sessions/pomodoro-sessions.route.js";
import PomodoroSessionsRepository from "./sessions/pomodoro-sessions.repository.js";
import PomodoroSessionsService from "./sessions/pomodoro-sessions.service.js";
import PomodoroSessionsController from "./sessions/pomodoro-sessions.controller.js";
const pomodoroTasksRouter = Router();
const pomodoroTaskRepository = new PomodoroTaskRepository();
const pomodoroTaskService = new PomodoroTaskService(pomodoroTaskRepository);
const pomodoroTasksController = new PomodoroTasksController(pomodoroTaskService);
// Initialize sessions components for stats endpoint
const pomodoroSessionsRepository = new PomodoroSessionsRepository();
const pomodoroSessionsService = new PomodoroSessionsService(pomodoroSessionsRepository);
const pomodoroSessionsController = new PomodoroSessionsController(pomodoroSessionsService);
// Task routes
pomodoroTasksRouter.get("/tasks", tryCatch(pomodoroTasksController.getAll));
pomodoroTasksRouter.get("/tasks/available", tryCatch(pomodoroTasksController.getAvailableTasks));
pomodoroTasksRouter.get("/tasks/:id", tryCatch(pomodoroTasksController.getById));
pomodoroTasksRouter.post("/tasks", validation(createPomodoroTaskSchema), tryCatch(pomodoroTasksController.create));
pomodoroTasksRouter.patch("/tasks/:id", validation(updatePomodoroTaskSchema), tryCatch(pomodoroTasksController.update));
pomodoroTasksRouter.delete("/tasks/:id", tryCatch(pomodoroTasksController.delete));
// Sessions routes
pomodoroTasksRouter.use("/sessions", pomodoroSessionsRouter);
// Stats endpoint
pomodoroTasksRouter.get("/stats", tryCatch(pomodoroSessionsController.getPomosStats));
export default pomodoroTasksRouter;
