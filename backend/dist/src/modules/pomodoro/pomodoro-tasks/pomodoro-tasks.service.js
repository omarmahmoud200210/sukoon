import PomodoroTaskRepository from "./pomodoro-tasks.repository.js";
class PomodoroTaskService {
    pomodoroTaskRepository;
    constructor(pomodoroTaskRepository) {
        this.pomodoroTaskRepository = pomodoroTaskRepository;
    }
    async getAllPomodoroTasks(userId) {
        return await this.pomodoroTaskRepository.getAllPomodoroTasks(userId);
    }
    async getPomodoroTaskById(id, userId) {
        return await this.pomodoroTaskRepository.getPomodoroTaskById(id, userId);
    }
    async createPomodoroTask(userId, title, duration = 25) {
        return await this.pomodoroTaskRepository.createPomodoroTask(userId, title, duration);
    }
    async updatePomodoroTask(id, userId, title, duration, isArchived) {
        return await this.pomodoroTaskRepository.updatePomodoroTask(id, userId, title, duration, isArchived);
    }
    async deletePomodoroTask(id, userId) {
        return await this.pomodoroTaskRepository.deletePomodoroTask(id, userId);
    }
    async getAvailableTasks(userId) {
        return await this.pomodoroTaskRepository.getAvailableTasks(userId);
    }
}
export default PomodoroTaskService;
