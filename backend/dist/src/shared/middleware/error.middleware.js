import { NextFunction, Request, Response } from "express";
export const errorHandlerMiddleware = (error, req, res, next) => {
    console.error(`[Error] ${error.message}`);
    // Default error status and message
    const status = 500;
    const message = error.message || "Internal Server Error";
    res.status(status).json({
        success: false,
        message,
    });
};
