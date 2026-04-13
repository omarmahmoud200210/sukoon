import jwt, {} from "jsonwebtoken";
import { AppError } from "./error.js";
import { AuthErrorCode } from "../constants/enums.js";
import prisma from "../database/prisma.js";
const checkAuth = async (req, _res, next) => {
    try {
        let token = null;
        if (!token && req.cookies?.access_token) {
            token = req.cookies.access_token;
        }
        if (!token) {
            throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
        }
        const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        const userId = Number(payload.id);
        if (isNaN(userId)) {
            throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true, isActive: true },
        });
        if (!user) {
            throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
        }
        if (!user.isActive) {
            throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
        }
        req.user = { id: user.id, role: user.role };
        next();
    }
    catch (err) {
        if (err instanceof AppError) {
            return next(err);
        }
        if (err instanceof jwt.TokenExpiredError) {
            return next(AppError.Unauthorized(AuthErrorCode.TOKEN_EXPIRED));
        }
        return next(AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID));
    }
};
export const requireAdmin = (req, _res, next) => {
    if (!req.user) {
        return next(AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID));
    }
    if (req.user.role !== "ADMIN") {
        return next(AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID));
    }
    next();
};
export default checkAuth;
