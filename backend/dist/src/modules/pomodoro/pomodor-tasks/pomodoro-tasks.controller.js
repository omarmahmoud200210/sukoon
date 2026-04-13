import PomodoroTaskService from "./pomodoro-tasks.service.js";
class PomodoroTasksController {
    pomodoroTaskService;
    constructor(pomodoroTaskService) {
        this.pomodoroTaskService = pomodoroTaskService;
    }
    getAll = async (req, res) => {
        const userId = req.user.id;
        const tasks = await this.pomodoroTaskService.getAllPomodoroTasks(userId);
        return res.status(200).json(tasks);
    };
    getById = async (req, res) => {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const task = await this.pomodoroTaskService.getPomodoroTaskById(id, userId);
        if (!task) {
            return res.status(404).json({ message: "Pomodoro task not found" });
        }
        return res.status(200).json(task);
    };
    create = async (req, res) => {
        const userId = req.user.id;
        const { title, duration } = req.body;
        const task = await this.pomodoroTaskService.createPomodoroTask(userId, title, duration);
        return res.status(201).json(task);
    };
    update = async (req, res) => {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const { title, duration } = req.body;
        const task = await this.pomodoroTaskService.updatePomodoroTask(id, userId, title, duration);
        if (!task) {
            return res.status(404).json({ message: "Pomodoro task not found" });
        }
        return res.status(200).json(task);
    };
    delete = async (req, res) => {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const task = await this.pomodoroTaskService.deletePomodoroTask(id, userId);
        if (!task) {
            return res.status(404).json({ message: "Pomodoro task not found" });
        }
        return res.status(200).json(task);
    };
    getAvailableTasks = async (req, res) => {
        const userId = req.user.id;
        const tasks = await this.pomodoroTaskService.getAvailableTasks(userId);
        return res.status(200).json(tasks);
    };
}
export default PomodoroTasksController;
