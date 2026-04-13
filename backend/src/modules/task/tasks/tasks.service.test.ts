import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import TaskService from "./tasks.service.js";
import TaskRepository from "./tasks.repository.js";
import type { Task } from "@prisma/client";

vi.mock("./tasks.repository.js");

describe("TaskService", () => {
  let taskService: TaskService;
  let mockTaskRepository: Mocked<TaskRepository>;

  const mockTasks: Task[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    title: `Task ${i + 1}`,
    description: "description",
    isCompleted: false,
    dueDate: new Date(),
    priority: "MEDIUM",
    userId: 1,
    listId: 1,
    position: i,
    isTrash: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    mockTaskRepository = {
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
    } as unknown as Mocked<TaskRepository>;

    taskService = new TaskService(mockTaskRepository);
  });

  describe("Pagination Logic (cursorPaginate)", () => {
    it("should return hasNextPage as true and provide nextCursor when tasks length is greater than limit", async () => {
      // Setup mock to return 11 tasks
      mockTaskRepository.getAllUncompletedTasks.mockResolvedValue(
        mockTasks.slice(0, 11),
      );

      const result = await taskService.getAllUncompletedTasks(1, undefined, 10);

      expect(result.data).toHaveLength(10);
      expect(result.hasNextPage).toBe(true);
      expect(result.nextCursor).toBe(10);
    });

    it("should return hasNextPage as false and nextCursor as null when tasks length is exactly the limit", async () => {
      // Setup mock to return 10 tasks
      mockTaskRepository.getAllUncompletedTasks.mockResolvedValue(
        mockTasks.slice(0, 10),
      );

      const result = await taskService.getAllUncompletedTasks(1, undefined, 10);

      expect(result.data).toHaveLength(10);
      expect(result.hasNextPage).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it("should return hasNextPage as false and nextCursor as null when tasks length is less than the limit", async () => {
      // Setup mock to return 5 tasks
      mockTaskRepository.getAllUncompletedTasks.mockResolvedValue(
        mockTasks.slice(0, 5),
      );

      const result = await taskService.getAllUncompletedTasks(1, undefined, 10);

      expect(result.data).toHaveLength(5);
      expect(result.hasNextPage).toBe(false);
      expect(result.nextCursor).toBeNull();
    });
  });

  describe("CRUD Operations", () => {
    it("should correctly pass payload to createTask", async () => {
      const taskData = {
        title: "New Task",
        description: "desc",
        listId: 1,
        tagIds: 0,
        userId: 1,
      };
      mockTaskRepository.createTask.mockResolvedValue(mockTasks[0]!);

      const result = await taskService.createTask(taskData, 1);

      expect(mockTaskRepository.createTask).toHaveBeenCalledWith(1, taskData);
      expect(result).toEqual(mockTasks[0]);
    });

    it("should correctly pass payload to updateTask", async () => {
      const taskData = { title: "Updated", priority: "HIGH" as any };
      mockTaskRepository.updateTask.mockResolvedValue({
        ...mockTasks[0],
        ...taskData,
      } as Task);

      const result = await taskService.updateTask("task-1", taskData, 1);

      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
        "task-1",
        taskData,
        1,
      );
      expect(result.title).toBe("Updated");
      expect(result.priority).toBe("HIGH");
    });

    it("should correctly pass payload to deleteTask", async () => {
      mockTaskRepository.deleteTask.mockResolvedValue(mockTasks[0]!);

      const result = await taskService.deleteTask("task-1", 1);

      expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith("task-1", 1);
      expect(result).toEqual(mockTasks[0]);
    });
  });
});
