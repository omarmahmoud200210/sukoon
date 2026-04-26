import SubTaskService from "./subtasks.service.js";
class SubTasksController {
    subTaskService;
    constructor(subTaskService) {
        this.subTaskService = subTaskService;
    }
    getAll = async (req, res) => {
        const taskId = Number(req.params.taskId);
        const subTasks = await this.subTaskService.getAllSubTasks(taskId);
        return res.status(200).json(subTasks);
    };
    create = async (req, res) => {
        const { title, taskId } = req.body;
        const subTask = await this.subTaskService.createSubTask(Number(taskId), {
            title,
        });
        return res.status(201).json(subTask);
    };
    update = async (req, res) => {
        const { taskId, subTaskId } = req.params;
        const { title, isCompleted } = req.body;
        const userId = req.user.id;
        const subTask = await this.subTaskService.updateSubTask(Number(subTaskId), { title, isCompleted }, Number(taskId), userId);
        return res.status(200).json(subTask);
    };
    delete = async (req, res) => {
        const { taskId, subTaskId } = req.params;
        const subTask = await this.subTaskService.deleteSubTask(Number(subTaskId), Number(taskId));
        return res.status(200).json(subTask);
    };
}
export default SubTasksController;
