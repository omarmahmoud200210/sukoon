import type { RequestHandler } from "express";
import PomodoroTaskService from "./pomodoro-tasks.service.js";
import { AppError } from "../../../shared/middleware/error.js";

class PomodoroTasksController {
  constructor(private pomodoroTaskService: PomodoroTaskService) {}

  getAll: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tasks = await this.pomodoroTaskService.getAllPomodoroTasks(userId);
    return res.status(200).json(tasks);
  };

  getById: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const task = await this.pomodoroTaskService.getPomodoroTaskById(id, userId);

    if (!task) {
      throw AppError.NotFound("Pomodoro task not found");
    }

    return res.status(200).json(task);
  };

  create: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const { title, duration } = req.body;

    const task = await this.pomodoroTaskService.createPomodoroTask(
      userId,
      title,
      duration,
    );

    return res.status(201).json(task);
  };

  update: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const { title, duration, isArchived } = req.body;

    const task = await this.pomodoroTaskService.updatePomodoroTask(
      id,
      userId,
      title,
      duration,
      isArchived,
    );

    if (!task) {
      return res.status(404).json({ message: "Pomodoro task not found" });
    }

    return res.status(200).json(task);
  };

  delete: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const task = await this.pomodoroTaskService.deletePomodoroTask(id, userId);

    if (!task) {
      return res.status(404).json({ message: "Pomodoro task not found" });
    }

    return res.status(200).json(task);
  };

  getAvailableTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tasks = await this.pomodoroTaskService.getAvailableTasks(userId);
    return res.status(200).json(tasks);
  };
}

export default PomodoroTasksController;
