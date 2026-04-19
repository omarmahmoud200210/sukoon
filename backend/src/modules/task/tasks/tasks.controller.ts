import type { RequestHandler } from "express";
import TaskService from "./tasks.service.js";
import { AppError } from "../../../shared/middleware/error.js";

class TasksController {
  constructor(private taskService: TaskService) {}

  getAll: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const [completedTasks, notCompletedTasks] = await Promise.all([
      this.taskService.getAllCompletedTasks(userId, cursor, limit),
      this.taskService.getAllUncompletedTasks(userId, cursor, limit),
    ]);

    res.status(200).json({
      notCompletedTasks: notCompletedTasks.data,
      notCompletedNextCursor: notCompletedTasks.nextCursor,
      notCompletedHasNextPage: notCompletedTasks.hasNextPage,
      completedTasks: completedTasks.data,
      nextCursor: completedTasks.nextCursor,
      hasNextPage: completedTasks.hasNextPage,
    });
  };

  getTodayTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const tasks = await this.taskService.getTodaysTasks(userId, cursor, limit);
    res.status(200).json(tasks);
  };

  getUpcomingTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const tasks = await this.taskService.getUpcomingTasks(
      userId,
      cursor,
      limit,
    );
    res.status(200).json(tasks);
  };

  getOverdueTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const tasks = await this.taskService.getOverdueTasks(userId, cursor, limit);
    res.status(200).json(tasks);
  };

  create: RequestHandler = async (req, res) => {
    const { title, description, listId, tagIds } = req.body;
    const userId = req.user!.id;

    const task = await this.taskService.createTask(
      {
        title,
        description,
        listId,
        tagIds,
        userId,
      },
      userId,
    );

    res.status(201).json(task);
  };

  getById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.id;

    if (typeof id !== "string") {
      throw AppError.BadRequest("Invalid ID");
    }

    const task = await this.taskService.getTaskById(id, userId);
    return res.status(200).json(task);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      dueDate,
      isCompleted,
      tagIds,
      listId,
      position,
    } = req.body;
    const userId = req.user!.id;

    if (typeof id !== "string") {
      throw AppError.BadRequest("Invalid ID");
    }

    const task = await this.taskService.updateTask(
      id,
      {
        title,
        description,
        priority,
        dueDate,
        isCompleted,
        tagIds,
        listId,
        position,
      },
      userId,
    );

    return res.status(200).json(task);
  };

  getAllTrash: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const tasks = await this.taskService.getAllTrashTasks(
      userId,
      cursor,
      limit,
    );
    return res.status(200).json(tasks);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.id;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const task = await this.taskService.deleteTask(id, userId);
    return res.status(200).json(task);
  };

  deleteTrash: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.id;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const task = await this.taskService.deleteTrashTask(id, userId);
    return res.status(200).json(task);
  };

  restore: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.id;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const task = await this.taskService.restoreTask(id, userId);
    return res.status(200).json(task);
  };
}
export default TasksController;
