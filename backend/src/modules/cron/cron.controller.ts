import type { Request, Response } from "express";
import logger from "../../shared/utils/logger.js";
import PomodoroSessionsRepository from "../pomodoro/sessions/pomodoro-sessions.repository.js";
import PomodoroSessionsService from "../pomodoro/sessions/pomodoro-sessions.service.js";
import QuranAyaRepository from "../quranAya/quranAya.repo.js";
import QuranAyaService from "../quranAya/quranAya.service.js";
import PersonalizedAyaService from "../personalizedAya/personalizedAya.service.js";
import PersonalizedAyaRepo from "../personalizedAya/personalizedAya.repo.js";
import AuthRepository from "../auth/auth.repositorty.js";

export const triggerMidnightJobs = async (_req: Request, res: Response) => {
  logger.info("[CRON] Received HTTP trigger for midnight jobs");

  // We do not await these intentionally so the HTTP request completes quickly
  // and Railway doesn't time it out (especially important for sequential AI calls).
  runSplittingSessions();
  runQuranAya();
  runPersonalizedQuranAya();

  res.status(202).json({
    status: "success",
    message: "Midnight jobs triggered successfully in the background",
  });
};

const runSplittingSessions = async () => {
  try {
    const repos = new PomodoroSessionsRepository();
    const services = new PomodoroSessionsService(repos);
    const result = await services.splitCrossDaySession();
    logger.info("[CRON] Session split job completed successfully", { result });
  } catch (err) {
    logger.error("[CRON] Session split job failed", { error: err });
  }
};

const runQuranAya = async () => {
  try {
    const MAX_AYA_NUMBER = 6236;
    const quranAyaRepo = new QuranAyaRepository();
    const quranAyaService = new QuranAyaService(quranAyaRepo);
    const ayaNumber = Math.floor(Math.random() * MAX_AYA_NUMBER) + 1;
    const aya = await quranAyaService.getQuranAya(ayaNumber);
    await quranAyaService.createQuranAya(aya);
    logger.info("[CRON] Quran aya job completed successfully", { aya });
  } catch (err) {
    logger.error("[CRON] Quran aya job failed", { error: err });
  }
};

const runPersonalizedQuranAya = async () => {
  try {
    const authRepo = new AuthRepository();
    const personalizedAyaRepo = new PersonalizedAyaRepo();
    const personalizedAyaService = new PersonalizedAyaService(personalizedAyaRepo);
    const users = await authRepo.getAllUsers();
    
    for (const user of users) {
      try {
        await personalizedAyaService.personalizedAyaWithAI(user.id);
        logger.info(`[CRON] Personalized Quran Aya generated for user ${user.id}`);
      } catch (err) {
        logger.error(`[CRON] Failed to generate personalized Aya for user ${user.id}`, { error: err });
      }
    }
    logger.info("[CRON] Personalized Quran aya job completed successfully");
  } catch (err) {
    logger.error("[CRON] Personalized Quran aya job failed", { error: err });
  }
};
