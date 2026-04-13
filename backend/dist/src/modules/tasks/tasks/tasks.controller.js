import TaskService from "../tasks.service.js";
class TasksController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    getAll = async (req, res) => {
        const userId = Number(req.user.id);
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const completedTasks = await this.taskService.getAllCompletedTasks(userId, cursor, limit);
        const notCompletedTasks = await this.taskService.getAllUncompletedTasks(userId);
        res.status(200).json({
            notCompletedTasks,
            completedTasks: completedTasks.tasks,
            nextCursor: completedTasks.nextCursor,
            hasNextPage: completedTasks.hasNextPage,
        });
    };
    getTodayTasks = async (req, res) => {
        const userId = Number(req.user.id);
        const tasks = await this.taskService.getTodaysTasks(userId);
        res.status(200).json(tasks);
    };
    getUpcomingTasks = async (req, res) => {
        const userId = Number(req.user.id);
        const tasks = await this.taskService.getUpcomingTasks(userId);
        res.status(200).json(tasks);
    };
    getOverdueTasks = async (req, res) => {
        const userId = Number(req.user.id);
        const tasks = await this.taskService.getOverdueTasks(userId);
        res.status(200).json(tasks);
    };
    create = async (req, res) => {
        const { title, description } = req.body;
        const userId = Number(req.user.id);
        const task = await this.taskService.createTask({
            title,
            description,
            userId,
        }, userId);
        res.status(201).json(task);
    };
    getById = async (req, res) => {
        const { id } = req.params;
        const userId = Number(req.user.id);
        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const task = await this.taskService.getTaskById(id, userId);
        return res.status(200).json(task);
    };
    update = async (req, res) => {
        const { id } = req.params;
        const { title, description, priority, dueDate } = req.body;
        const userId = Number(req.user.id);
        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const task = await this.taskService.updateTask(id, {
            title,
            description,
            priority,
            dueDate,
        }, userId);
        return res.status(200).json(task);
    };
    delete = async (req, res) => {
        const { id } = req.params;
        const userId = Number(req.user.id);
        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const task = await this.taskService.deleteTask(id, userId);
        return res.status(200).json(task);
    };
}
export default TasksController;
