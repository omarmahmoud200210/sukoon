import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const level = () => {
    const env = process.env.NODE_ENV || "development";
    return env === "production" ? "warn" : "debug";
};
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "blue",
    debug: "white",
};
winston.addColors(colors);
const format = winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.json(), winston.format.errors({ stack: true }));
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
    }),
    new DailyRotateFile({
        filename: "logs/application-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
    }),
    new DailyRotateFile({
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        level: "error",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
    }),
];
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
});
export default logger;
