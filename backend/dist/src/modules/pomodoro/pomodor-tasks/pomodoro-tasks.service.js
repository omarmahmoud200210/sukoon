import PomodoroTaskRepository from "./pomodoro-tasks.repository.js";
class PomodoroTaskService {
    pomodoroTaskRepository;
    constructor(pomodoroTaskRepository) {
        this.pomodoroTaskRepository = pomodoroTaskRepository;
    }
    getAllPomodoroTasks(userId) {
        return this.pomodoroTaskRepository.getAllPomodoroTasks(userId);
    }
    getPomodoroTaskById(id, userId) {
        return this.pomodoroTaskRepository.getPomodoroTaskById(id, userId);
    }
    createPomodoroTask(userId, title, duration = 25) {
        return this.pomodoroTaskRepository.createPomodoroTask(userId, title, duration);
    }
    updatePomodoroTask(id, userId, title, duration) {
        return this.pomodoroTaskRepository.updatePomodoroTask(id, userId, title, duration);
    }
    deletePomodoroTask(id, userId) {
        return this.pomodoroTaskRepository.deletePomodoroTask(id, userId);
    }
    getAvailableTasks(userId) {
        return this.pomodoroTaskRepository.getAvailableTasks(userId);
    }
}
export default PomodoroTaskService;
