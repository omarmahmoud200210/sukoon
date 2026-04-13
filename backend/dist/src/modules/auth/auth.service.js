import argon2 from "argon2";
import jwt from "jsonwebtoken";
import sendEmail from "../../shared/utils/email.utils.js";
import { generateTokens, generateForgotPasswordToken, generateVerificationToken, } from "../../shared/utils/token.utils.js";
import { AppError } from "../../shared/middleware/error.js";
import AuthRepository from "./auth.repositorty.js";
import { AuthErrorCode } from "../../shared/constants/enums.js";
import uploadImage from "../../shared/utils/upload.utils.js";
class AuthenticationServices {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    login = async (email, password) => {
        const user = await this.authRepository.login(email);
        if (!user)
            throw new Error("The User Not Exist");
        if (user?.isVerified) {
            const verifyPassword = await argon2.verify(user.passwordHashed, password);
            if (!verifyPassword)
                throw new Error("Invalid password");
            return {
                tokens: generateTokens(user.id),
                status: user.isVerified,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatarUrl: user.avatarUrl,
                    isVerified: user.isVerified,
                },
            };
        }
        return {
            status: false,
            message: "Email is not verified",
        };
    };
    getUser = async (userId) => {
        const user = await this.authRepository.getUser(userId);
        if (!user)
            throw AppError.Unauthorized("User not found");
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            isVerified: user.isVerified,
            oauth: user.oauth,
            role: user.role,
        };
    };
    register = async (data) => {
        const { password, ...userData } = data;
        const user = await this.authRepository.getUser(undefined, userData.email);
        if (user)
            throw AppError.Unauthorized(AuthErrorCode.USER_ALREADY_EXISTS);
        const password_hash = await argon2.hash(password);
        const newUser = await this.authRepository.register(userData, password_hash);
        const verifyEmailToken = generateVerificationToken(newUser.id);
        await sendEmail({
            to: userData.email,
            subject: "Verify Email",
            text: `Verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify-email?token=${verifyEmailToken}`,
            html: `
        <h1>Verify Email</h1>
        <p>Verify your email by clicking this link: <a href="${process.env.FRONTEND_URL}/verify-email?token=${verifyEmailToken}">Verify Email</a></p>
      `,
        });
        return {
            email: newUser.email,
            message: "User is Registered but still not verified!!",
        };
    };
    forgotPassword = async (email) => {
        const user = await this.authRepository.getUser(undefined, email);
        if (!user || !user.isVerified)
            return { success: true };
        const accessToken = generateForgotPasswordToken(user.id);
        await sendEmail({
            to: email,
            subject: "Reset Password",
            text: `Reset your password by clicking this link: ${process.env.FRONTEND_URL}/reset-password?token=${accessToken}`,
            html: `
        <h1>Reset Password</h1>
        <p>Reset your password by clicking this link: <a href="${process.env.FRONTEND_URL}/reset-password?token=${accessToken}">Reset Password</a></p>
      `,
        });
        return { success: true };
    };
    resetPassword = async (token, password) => {
        const verifyToken = jwt.verify(token, process.env.JWT_FORGOT_PASSWORD_TOKEN);
        if (!verifyToken)
            throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
        const payload = verifyToken;
        const user = await this.authRepository.getUser(Number(payload.id));
        if (!user)
            return { success: true };
        const password_hash = await argon2.hash(password);
        await this.authRepository.resetPassword(Number(payload.id), password_hash);
        return { success: true };
    };
    verifyEmail = async (token) => {
        const verifyToken = jwt.verify(token, process.env.JWT_VERIFICATION_TOKEN);
        if (!verifyToken)
            throw new Error("Invalid token");
        const payload = verifyToken;
        const user = await this.authRepository.getUser(Number(payload.id));
        if (!user)
            throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
        await this.authRepository.verifyEmail(Number(payload.id));
        return { message: "User verified successfully" };
    };
    googleLogin = async (profile) => {
        let user = await this.authRepository.googleLogin(profile);
        if (!user)
            user = await this.authRepository.googleRegister(profile);
        const { accessToken, refreshToken } = generateTokens(user.id);
        return { user, accessToken, refreshToken };
    };
    changeFirstNameAndLastName = async (userId, firstName, lastName) => {
        const user = await this.authRepository.getUser(userId);
        if (!user)
            throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
        return await this.authRepository.changeFirstNameAndLastName(userId, firstName, lastName);
    };
    changePassword = async (userId, password) => {
        const user = await this.authRepository.getUser(userId);
        if (!user)
            throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
        const password_hash = await argon2.hash(password);
        return await this.authRepository.changePassword(userId, password_hash);
    };
    deleteAccount = async (userId) => {
        const user = await this.authRepository.getUser(userId);
        if (!user)
            throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
        return await this.authRepository.deleteAccount(userId);
    };
    uploadAvatar = async (userId, buffer) => {
        const user = await this.authRepository.getUser(userId);
        if (!user)
            throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
        const avatarUrl = await uploadImage(buffer);
        return await this.authRepository.uploadAvatar(userId, avatarUrl);
    };
}
export default AuthenticationServices;
