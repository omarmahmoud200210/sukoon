import PomodoroSessionsService from "./pomodoro-sessions.service.js";
class PomodoroSessionsController {
    pomodoroSessionsService;
    constructor(pomodoroSessionsService) {
        this.pomodoroSessionsService = pomodoroSessionsService;
    }
    start = async (req, res) => {
        const userId = req.user.id;
        const { taskId, pomodoroTaskId, duration, sessionCount } = req.body;
        const timezoneOffset = parseInt(req.headers["x-timezone-offset"]) || 0;
        const session = await this.pomodoroSessionsService.startSession(userId, duration, taskId, pomodoroTaskId, sessionCount, timezoneOffset);
        return res.status(201).json(session);
    };
    togglePause = async (req, res) => {
        const userId = req.user.id;
        const session = await this.pomodoroSessionsService.togglePauseSession(userId);
        return res.status(200).json(session);
    };
    complete = async (req, res) => {
        const userId = req.user.id;
        const session = await this.pomodoroSessionsService.completeSession(userId);
        return res.status(200).json(session);
    };
    reset = async (req, res) => {
        const userId = req.user.id;
        await this.pomodoroSessionsService.resetSession(userId);
        return res.status(200).json({ message: "Session reset successfully" });
    };
    delete = async (req, res) => {
        const userId = req.user.id;
        const sessionId = parseInt(req.params.sessionId);
        await this.pomodoroSessionsService.deleteSession(userId, sessionId);
        return res.status(200).json({ message: "Session deleted successfully" });
    };
    getActive = async (req, res) => {
        const userId = req.user.id;
        const session = await this.pomodoroSessionsService.getActiveSession(userId);
        return res.status(200).json(session);
    };
    getAll = async (req, res) => {
        const userId = req.user.id;
        const sessions = await this.pomodoroSessionsService.getAllSessions(userId);
        return res.status(200).json(sessions);
    };
    getPomosStats = async (req, res) => {
        const userId = req.user.id;
        const offset = parseInt(req.headers["x-timezone-offset"]) || 0;
        const stats = await this.pomodoroSessionsService.getPomosStatistics(userId, offset);
        return res.status(200).json(stats);
    };
    getTaskStats = async (req, res) => {
        const userId = req.user.id;
        const taskId = parseInt(req.params.taskId);
        const offset = parseInt(req.headers["x-timezone-offset"]) || 0;
        const stats = await this.pomodoroSessionsService.getTaskStatistics(userId, taskId, offset);
        return res.status(200).json(stats);
    };
    getHistory = async (req, res) => {
        const userId = req.user.id;
        const history = await this.pomodoroSessionsService.getHistoryGrouped(userId);
        return res.status(200).json(history);
    };
}
export default PomodoroSessionsController;
