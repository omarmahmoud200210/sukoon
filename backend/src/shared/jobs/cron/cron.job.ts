import cron from "node-cron";
import logger from "../../utils/logger.js";
import PomodoroSessionsRepository from "../../../modules/pomodoro/sessions/pomodoro-sessions.repository.js";
import PomodoroSessionsService from "../../../modules/pomodoro/sessions/pomodoro-sessions.service.js";
import QuranAyaRepository from "../../../modules/quranAya/quranAya.repo.js";
import QuranAyaService from "../../../modules/quranAya/quranAya.service.js";
import PersonalizedAyaService from "../../../modules/personalizedAya/personalizedAya.service.js";
import PersonalizedAyaRepo from "../../../modules/personalizedAya/personalizedAya.repo.js";
import AuthRepository from "../../../modules/auth/auth.repositorty.js";

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
    const personalizedAyaService = new PersonalizedAyaService(
      personalizedAyaRepo,
    );
    const users = await authRepo.getAllUsers();

    for (const user of users) {
      try {
        const existingPersonalizedAya =
          await personalizedAyaRepo.getPersonalizedAya(user.id);
        if (existingPersonalizedAya) {
          logger.info(
            `[CRON] Personalized Quran Aya already generated for user ${user.id}`,
          );
          continue;
        }

        await personalizedAyaService.personalizedAyaWithAI(user.id);
        logger.info(
          `[CRON] Personalized Quran Aya generated for user ${user.id}`,
        );
      } catch (err) {
        logger.error(
          `[CRON] Failed to generate personalized Aya for user ${user.id}`,
          { error: err },
        );
      }
    }
    logger.info("[CRON] Personalized Quran aya job completed successfully");
  } catch (err) {
    logger.error("[CRON] Personalized Quran aya job failed", { error: err });
  }
};

export const initializeCronJobs = () => {
  logger.info("[CRON] Initializing background cron jobs...");

  // Schedule tasks to run every day at midnight (00:00) server time
  cron.schedule("0 0 * * *", async () => {
    logger.info("[CRON] Starting midnight jobs...");
    await runSplittingSessions();
    await runQuranAya();
    await runPersonalizedQuranAya();
    logger.info("[CRON] Midnight jobs finished");
  });
};
