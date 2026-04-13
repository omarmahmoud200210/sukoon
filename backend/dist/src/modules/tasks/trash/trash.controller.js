import TrashService from "./trash.service.js";
class TrashController {
    trashService;
    constructor(trashService) {
        this.trashService = trashService;
    }
    getAllTasksFromTrash = async (req, res) => {
        const userId = Number(req.user.id);
        const tasks = await this.trashService.getAllTasksFromTrash(userId);
        return res.status(200).json(tasks);
    };
    deleteTaskFromTrash = async (req, res) => {
        const taskId = Number(req.params.taskId);
        const userId = Number(req.user.id);
        const task = await this.trashService.permanentlyDeleteTask(taskId, userId);
        return res.status(200).json(task);
    };
    undoTaskFromTrash = async (req, res) => {
        const taskId = Number(req.params.taskId);
        const userId = Number(req.user.id);
        const task = await this.trashService.undoTaskFromTrash(taskId, userId);
        return res.status(200).json(task);
    };
}
export default TrashController;
