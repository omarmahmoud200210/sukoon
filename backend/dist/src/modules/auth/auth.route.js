import express from "express";
import AuthenticationController from "./auth.controller.js";
import AuthenticationServices from "./auth.service.js";
import validation from "../../shared/middleware/validation.js";
import passport from "passport";
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema, ChangeFirstNameAndLastNameSchema, ChangePasswordSchema, } from "./auth.schema.js";
import refreshToken from "../../shared/middleware/refreshToken.js";
import checkAuth from "../../shared/middleware/auth.js";
import RateLimiter from "../../shared/middleware/rateLimiting.js";
import tryCatch from "../../shared/utils/tryCatch.utils.js";
import AuthRepository from "./auth.repositorty.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const authRepository = new AuthRepository();
const authServices = new AuthenticationServices(authRepository);
const authController = new AuthenticationController(authServices);
const authRouter = express.Router();
authRouter.get("/me", checkAuth, authController.getUserData);
authRouter.post("/logout", checkAuth, authController.logout);
authRouter.post("/login", validation(LoginSchema), RateLimiter({
    windowSize: 60000, // 60 seconds
    max: 10,
    message: "Too many login attempts. Please try again later.",
}), tryCatch(authController.login));
authRouter.post("/register", validation(RegisterSchema), RateLimiter({
    windowSize: 60000,
    max: 10,
    message: "Too many register attempts. Please try again later.",
}), tryCatch(authController.register));
authRouter.post("/refresh", refreshToken, authController.refreshToken);
authRouter.post("/forgot-password", validation(ForgotPasswordSchema), RateLimiter({
    windowSize: 15 * 60 * 1000,
    max: 5,
    message: "Too many forgot-password attempts. Please try again later.",
}), tryCatch(authController.forgotPassword));
authRouter.post("/reset-password", validation(ResetPasswordSchema), tryCatch(authController.resetPassword));
authRouter.post("/verify-email", RateLimiter({
    windowSize: 2 * 60 * 1000, // 2 minutes
    max: 1,
    message: "Too many verify-email attempts. Please try again later.",
}), tryCatch(authController.verifyEmail));
authRouter.patch("/me/upload-avatar", checkAuth, upload.single("avatar"), tryCatch(authController.uploadAvatar));
authRouter.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
authRouter.get("/google/callback", passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
}), tryCatch(authController.googleLogin));
authRouter.put("/change-name", checkAuth, validation(ChangeFirstNameAndLastNameSchema), tryCatch(authController.changeFirstNameAndLastName));
authRouter.put("/change-password", checkAuth, validation(ChangePasswordSchema), tryCatch(authController.changePassword));
authRouter.delete("/delete-account", checkAuth, tryCatch(authController.deleteAccount));
export default authRouter;
