import cron from "node-cron";
import PomodoroSessionsRepository from "../../modules/pomodoro/sessions/pomodoro-sessions.repository.js";
import PomodoroSessionsService from "../../modules/pomodoro/sessions/pomodoro-sessions.service.js";
import QuranAyaRepository from "../../modules/quranAya/quranAya.repo.js";
import QuranAyaService from "../../modules/quranAya/quranAya.service.js";
import PersonalizedAyaService from "../../modules/personalizedAya/personalizedAya.service.js";
import PersonalizedAyaRepo from "../../modules/personalizedAya/personalizedAya.repo.js";
import AuthRepository from "../../modules/auth/auth.repositorty.js";
import logger from "../utils/logger.js";

export function splittingSessionsCronJob() {
  const repos = new PomodoroSessionsRepository();
  const services = new PomodoroSessionsService(repos);

  cron.schedule(
    "0 0 * * *",
    async () => {
      logger.info("[CRON] Running midnight session split job...");

      try {
        const result = await services.splitCrossDaySession();
        logger.info("[CRON] Session split job completed successfully", { result });
      } catch (err) {
        logger.error("[CRON] Session split job failed", { error: err });
      }
    },
    {
      timezone: "Africa/Cairo",
    },
  );

  logger.info("[CRON] Cron jobs initialized - Midnight session split enabled");
}

export function quranAyaCronJob() {
  const MAX_AYA_NUMBER = 6236;
  const quranAyaRepo = new QuranAyaRepository();
  const quranAyaService = new QuranAyaService(quranAyaRepo);

  logger.info("[CRON] Cron jobs initialized - Midnight quran aya enabled");

  cron.schedule(
    "0 0 * * *",
    async () => {
      logger.info("[CRON] Running Quran aya job...");
      try {
        const ayaNumber = Math.floor(Math.random() * MAX_AYA_NUMBER) + 1;
        const aya = await quranAyaService.getQuranAya(ayaNumber);
        await quranAyaService.createQuranAya(aya);

        logger.info("[CRON] Quran aya job completed successfully", { aya });
      } catch (err) {
        logger.error("[CRON] Quran aya job failed", { error: err });
      }
    },
    {
      timezone: "Africa/Cairo",
    },
  );

  logger.info("[CRON] Cron jobs initialized - Midnight quote enabled");
}

export function personalizedQuranAyaCronJob() {
  const authRepo = new AuthRepository();
  const personalizedAyaRepo = new PersonalizedAyaRepo();
  const personalizedAyaService = new PersonalizedAyaService(personalizedAyaRepo);

  cron.schedule("0 0 * * *", async () => {
    logger.info("[CRON] Running personalized Quran Aya job...");
    try {
      const users = await authRepo.getAllUsers();
      for (const user of users) {
        try {
          await personalizedAyaService.personalizedAyaWithAI(user.id);
          logger.info(`[CRON] Personalized Quran Aya generated for user ${user.id}`);
        } catch (err) {
          logger.error(`[CRON] Failed to generate personalized Aya for user ${user.id}`, { error: err });
        }
      }
    }
    catch (err) {
      logger.error("[CRON] Personalized Quran aya job failed", { error: err });
    }
  }, {
    timezone: "Africa/Cairo",
  })

  logger.info("[CRON] Cron jobs initialized - Midnight personalized quran aya enabled");
}