import { Router } from "express";
import { triggerMidnightJobs } from "./cron.controller.js";
import { requireCronSecret } from "../../shared/middleware/cronAuth.js";
const router = Router();
router.post("/midnight", requireCronSecret, triggerMidnightJobs);
export default router;
