import type { RequestHandler } from "express";
import PomodoroSessionsService from "./pomodoro-sessions.service.js";

class PomodoroSessionsController {
  constructor(private pomodoroSessionsService: PomodoroSessionsService) {}

  start: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const { taskId, pomodoroTaskId, duration, sessionCount } = req.body;
    const timezoneOffset = parseInt(req.headers["x-timezone-offset"] as string) || 0;

    const session = await this.pomodoroSessionsService.startSession(
      userId,
      duration,
      taskId,
      pomodoroTaskId,
      sessionCount,
      timezoneOffset,
    );

    return res.status(201).json(session);
  };

  togglePause: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const session = await this.pomodoroSessionsService.togglePauseSession(userId);
    return res.status(200).json(session);
  };

  complete: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const session = await this.pomodoroSessionsService.completeSession(userId);
    return res.status(200).json(session);
  };

  reset: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    await this.pomodoroSessionsService.resetSession(userId);
    return res.status(200).json({ message: "Session reset successfully" });
  };

  delete: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const sessionId = parseInt(req.params.sessionId as string);
    await this.pomodoroSessionsService.deleteSession(userId, sessionId);
    return res.status(200).json({ message: "Session deleted successfully" });
  };

  getActive: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const session = await this.pomodoroSessionsService.getActiveSession(userId);
    return res.status(200).json(session);
  };

  getAll: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const sessions = await this.pomodoroSessionsService.getAllSessions(userId);
    return res.status(200).json(sessions);
  };

  getPomosStats: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const offset = parseInt(req.headers["x-timezone-offset"] as string) || 0;
    const stats = await this.pomodoroSessionsService.getPomosStatistics(userId, offset);
    return res.status(200).json(stats);
  };

  getTaskStats: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const taskId = parseInt(req.params.taskId as string);
    const offset = parseInt(req.headers["x-timezone-offset"] as string) || 0;
    const stats = await this.pomodoroSessionsService.getTaskStatistics(userId, taskId, offset);
    return res.status(200).json(stats);
  };

  getHistory: RequestHandler = async (req, res) => {
    const userId = req.user!.id;
    const history = await this.pomodoroSessionsService.getHistoryGrouped(userId);
    return res.status(200).json(history);
  };
}

export default PomodoroSessionsController;
