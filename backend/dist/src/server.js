import "./shared/utils/instrument.js";
import App from "./app.js";
import https from "https";
import fs from "fs";
import logger from "./shared/utils/logger.js";
const PORT = process.env.PORT || 3000;
try {
    const server = new App();
    const httpsOptions = {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.crt"),
    };
    https.createServer(httpsOptions, server.app).listen(PORT, () => {
        logger.info(`HTTPS Server is running on https://localhost:${PORT}`);
    });
}
catch (error) {
    console.error("Server initialization error:", error);
    if (error instanceof Error) {
        console.error("Stack trace:", error.stack);
    }
    logger.error("Server initialization error", { error });
    throw error;
}
