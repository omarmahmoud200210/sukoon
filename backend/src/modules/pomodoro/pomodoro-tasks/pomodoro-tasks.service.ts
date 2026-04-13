import PomodoroTaskRepository from "./pomodoro-tasks.repository.js";

class PomodoroTaskService {
  constructor(private pomodoroTaskRepository: PomodoroTaskRepository) {}

  async getAllPomodoroTasks(userId: number) {
    return await this.pomodoroTaskRepository.getAllPomodoroTasks(userId);
  }

  async getPomodoroTaskById(id: number, userId: number) {
    return await this.pomodoroTaskRepository.getPomodoroTaskById(id, userId);
  }

  async createPomodoroTask(userId: number, title: string, duration: number = 25) {
    return await this.pomodoroTaskRepository.createPomodoroTask(
      userId,
      title,
      duration,
    );
  }

  async updatePomodoroTask(
    id: number,
    userId: number,
    title?: string,
    duration?: number,
    isArchived?: boolean,
  ) {
    return await this.pomodoroTaskRepository.updatePomodoroTask(
      id,
      userId,
      title,
      duration,
      isArchived,
    );
  }

  async deletePomodoroTask(id: number, userId: number) {
    return await this.pomodoroTaskRepository.deletePomodoroTask(id, userId);
  }

  async getAvailableTasks(userId: number) {
    return await this.pomodoroTaskRepository.getAvailableTasks(userId);
  }
}

export default PomodoroTaskService;
