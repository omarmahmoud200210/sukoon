import "./shared/utils/instrument.js";
import App from "./app.js";
import logger from "./shared/utils/logger.js";

const PORT = process.env.PORT || 3000;

try {
  const server = new App();

  server.app.listen(PORT, () => {
    logger.info(`HTTP Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Server initialization error:", error);
  if (error instanceof Error) {
    console.error("Stack trace:", error.stack);
  }
  logger.error("Server initialization error", { error });
  throw error;
}
