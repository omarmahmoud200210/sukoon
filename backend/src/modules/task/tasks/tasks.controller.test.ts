import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import TasksController from "./tasks.controller.js";
import TaskService from "./tasks.service.js";
import type { Request, Response } from "express";
import { AppError } from "../../../shared/middleware/error.js";

vi.mock("./tasks.service.js");

describe("TasksController", () => {
  let tasksController: TasksController;
  let mockTaskService: Mocked<TaskService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTaskService = {
      getAllCompletedTasks: vi.fn(),
      getAllUncompletedTasks: vi.fn(),
      getTodaysTasks: vi.fn(),
      getUpcomingTasks: vi.fn(),
      getOverdueTasks: vi.fn(),
      getTaskById: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      getAllTrashTasks: vi.fn(),
      deleteTrashTask: vi.fn(),
      restoreTask: vi.fn(),
      deleteAllTasks: vi.fn(),
    } as unknown as Mocked<TaskService>;

    tasksController = new TasksController(mockTaskService);

    mockReq = {
      user: { id: 1 } as any,
      query: {},
      params: {},
      body: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  describe("Validation Fallbacks", () => {
    it("getById should throw AppError.BadRequest if id is missing or invalid type", async () => {
      mockReq.params = { id: undefined as any };

      await expect(
        tasksController.getById(
          mockReq as Request,
          mockRes as Response,
          vi.fn(),
        ),
      ).rejects.toThrow(AppError.BadRequest("Invalid ID"));
    });

    it("update should throw AppError.BadRequest if id is missing or invalid type", async () => {
      mockReq.params = { id: undefined as any };

      await expect(
        tasksController.update(
          mockReq as Request,
          mockRes as Response,
          vi.fn(),
        ),
      ).rejects.toThrow(AppError.BadRequest("Invalid ID"));
    });

    it("delete should return 400 if id is missing", async () => {
      mockReq.params = { id: undefined as any };

      await tasksController.delete(
        mockReq as Request,
        mockRes as Response,
        vi.fn(),
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid ID" });
    });
  });

  describe("CRUD Endpoint Calls", () => {
    it("getAll should combine completed and uncompleted tasks", async () => {
      mockTaskService.getAllCompletedTasks.mockResolvedValue({
        data: [{ id: "completed-1" } as any],
        nextCursor: null,
        hasNextPage: false,
      });
      mockTaskService.getAllUncompletedTasks.mockResolvedValue({
        data: [{ id: "uncompleted-1" } as any],
        nextCursor: "uncompleted-1" as unknown as number,
        hasNextPage: true,
      });

      await tasksController.getAll(
        mockReq as Request,
        mockRes as Response,
        vi.fn(),
      );

      expect(mockTaskService.getAllCompletedTasks).toHaveBeenCalledWith(
        1,
        undefined,
        10,
      );
      expect(mockTaskService.getAllUncompletedTasks).toHaveBeenCalledWith(
        1,
        undefined,
        10,
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        notCompletedTasks: [{ id: "uncompleted-1" }],
        notCompletedNextCursor: "uncompleted-1",
        notCompletedHasNextPage: true,
        completedTasks: [{ id: "completed-1" }],
        nextCursor: null,
        hasNextPage: false,
      });
    });

    it("create should pass body parameters and return 201", async () => {
      const taskBody = {
        title: "Title",
        description: "Desc",
        listId: "list-1",
        tagIds: [],
      };
      mockReq.body = taskBody;
      mockTaskService.createTask.mockResolvedValue({
        id: "new-task",
        ...taskBody,
      } as any);

      await tasksController.create(
        mockReq as Request,
        mockRes as Response,
        vi.fn(),
      );

      expect(mockTaskService.createTask).toHaveBeenCalledWith(
        { ...taskBody, userId: 1 },
        1,
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: "new-task" }),
      );
    });
  });
});
