import "./shared/utils/instrument.js";
import App from "./app.js";
import logger from "./shared/utils/logger.js";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeCronJobs } from "./shared/jobs/cron/cron.job.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

try {
  const appInstance = new App();

  // Initialize background jobs
  initializeCronJobs();
  const certPath = path.join(__dirname, "../server.crt");
  const keyPath = path.join(__dirname, "../server.key");

  let server;

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    server = https.createServer(options, appInstance.app);
    server.listen(PORT, () => {
      logger.info(`HTTPS Server is running on https://localhost:${PORT}`);
      logger.info(`running using ${certPath}, ${keyPath}`);
    });
  } else {
    server = http.createServer(appInstance.app);
    server.listen(PORT, () => {
      logger.info(`HTTP Server is running on http://localhost:${PORT}`);
    });
  }
} catch (error) {
  console.error("Server initialization error:", error);
  if (error instanceof Error) {
    console.error("Stack trace:", error.stack);
  }
  logger.error("Server initialization error", { error });
  throw error;
}
