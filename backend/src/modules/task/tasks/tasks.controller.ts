import type { RequestHandler } from "express";
import TaskService from "./tasks.service.js";
import { AppError } from "../../../shared/middleware/error.js";

class TasksController {
  constructor(private taskService: TaskService) {}

  getPendingTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tasks = await this.taskService.getAllUncompletedTasks(userId);
    res.status(200).json(tasks);
  };

  getCompletedTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tasks = await this.taskService.getAllCompletedTasks(userId);
    res.status(200).json(tasks);
  };

  getTodayTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const status = req.query.status as "pending" | "completed" | "all" | undefined;
    const tasks = await this.taskService.getTodaysTasks(userId, status);
    res.status(200).json(tasks);
  };

  getUpcomingTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const status = req.query.status as "pending" | "completed" | "all" | undefined;
    const tasks = await this.taskService.getUpcomingTasks(userId, status);
    res.status(200).json(tasks);
  };

  getOverdueTasks: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tasks = await this.taskService.getOverdueTasks(userId);
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

  createTodayTask: RequestHandler = async (req, res) => {
    const { title, description, listId, tagIds } = req.body;
    const userId = req.user!.id;
    const dueDate = new Date().toISOString();

    const task = await this.taskService.createTask(
      {
        title,
        description,
        listId,
        tagIds,
        userId,
        dueDate,
      },
      userId,
    );

    res.status(201).json(task);
  };

  createUpcomingTask: RequestHandler = async (req, res) => {
    const { title, description, listId, tagIds } = req.body;
    const userId = req.user!.id;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toISOString();

    const task = await this.taskService.createTask(
      {
        title,
        description,
        listId,
        tagIds,
        userId,
        dueDate,
      },
      userId,
    );

    res.status(201).json(task);
  };

  getTasksByList: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const listId = Number(req.params.listId);
    if (isNaN(listId)) {
      throw AppError.BadRequest("Invalid list ID");
    }
    const status = req.query.status as "pending" | "completed" | "all" | undefined;
    const tasks = await this.taskService.getTasksByList(userId, listId, status);
    res.status(200).json(tasks);
  };

  getTasksByTag: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tagId = Number(req.params.tagId);
    if (isNaN(tagId)) {
      throw AppError.BadRequest("Invalid tag ID");
    }
    const status = req.query.status as "pending" | "completed" | "all" | undefined;
    const tasks = await this.taskService.getTasksByTag(userId, tagId, status);
    res.status(200).json(tasks);
  };

  createTaskByList: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const listId = Number(req.params.listId);
    if (isNaN(listId)) {
      throw AppError.BadRequest("Invalid list ID");
    }
    const { title, description, tagIds } = req.body;

    const task = await this.taskService.createTask(
      { title, description, listId, tagIds, userId },
      userId,
    );
    res.status(201).json(task);
  };

  createTaskByTag: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const tagId = Number(req.params.tagId);
    if (isNaN(tagId)) {
      throw AppError.BadRequest("Invalid tag ID");
    }
    const { title, description, listId, tagIds } = req.body;

    const updatedTagIds = Array.isArray(tagIds) ? [...new Set([...tagIds, tagId])] : [tagId];

    const task = await this.taskService.createTask(
      { title, description, listId, tagIds: updatedTagIds, userId },
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
    const tasks = await this.taskService.getAllTrashTasks(userId);
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
