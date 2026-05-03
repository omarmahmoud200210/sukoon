import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { Profile } from "passport-google-oauth20";
import sendEmail from "../../shared/utils/email.utils.js";
import {
  generateTokens,
  generateForgotPasswordToken,
  generateVerificationToken,
} from "../../shared/utils/token.utils.js";
import type { User } from "@prisma/client";
import { AppError } from "../../shared/middleware/error.js";
import AuthRepository from "./auth.repositorty.js";
import { AuthErrorCode } from "../../shared/constants/enums.js";
import uploadImage from "../../shared/utils/upload.utils.js";
import logger from "../../shared/utils/logger.js";
class AuthenticationServices {
  constructor(private readonly authRepository: AuthRepository) {}

  login = async (email: string, password: string) => {
    const user = await this.authRepository.login(email);
    if (!user) throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);

    if (user?.isVerified) {
      const verifyPassword = await argon2.verify(user.passwordHashed, password);

      if (!verifyPassword)
        throw AppError.Unauthorized(AuthErrorCode.INVALID_CREDENTIALS);

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

  getUser = async (userId: number) => {
    const user = await this.authRepository.getUser(userId);

    if (!user) throw AppError.Unauthorized("User not found");

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

  register = async (
    data: Pick<User, "firstName" | "lastName" | "email"> & {
      password: string;
    },
  ) => {
    const { password, ...userData } = data;
    const password_hash = await argon2.hash(password);
    let newUser: User;

    try {
      const user = await this.authRepository.getUser(undefined, userData.email);
      if (user) throw AppError.Unauthorized(AuthErrorCode.USER_ALREADY_EXISTS);

      newUser = await this.authRepository.register(userData, password_hash);
      await this.authRepository.verifyEmail(newUser.id, false);
    } catch (error) {
      logger.error(error);
      throw AppError.InternalServerError(
        "Failed to register user. Please check your email configuration and try again.",
      );
    }

    const verifyEmailToken = generateVerificationToken(newUser.id);

    try {
      await sendEmail(userData.email, verifyEmailToken);
    } catch (error) {
      logger.error(error);
      throw AppError.InternalServerError(
        "Failed to send verification email. Please check your email configuration and try again.",
      );
    }

    return {
      email: newUser.email,
      message: "User is Registered but still not verified!!",
    };
  };

  forgotPassword = async (email: string) => {
    const user = await this.authRepository.getUser(undefined, email);
    if (!user || !user.isVerified) return { success: true };
    const accessToken = generateForgotPasswordToken(user.id);

    await sendEmail(email, accessToken);

    return { success: true };
  };

  resetPassword = async (token: string, password: string) => {
    const verifyToken = jwt.verify(
      token,
      process.env.JWT_FORGOT_PASSWORD_TOKEN!,
    );
    if (!verifyToken) throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
    const payload = verifyToken as jwt.JwtPayload;
    const user = await this.authRepository.getUser(Number(payload.id));

    if (!user) return { success: true };

    const password_hash = await argon2.hash(password);
    await this.authRepository.resetPassword(Number(payload.id), password_hash);

    return { success: true };
  };

  verifyEmail = async (token: string) => {
    const verifyToken = jwt.verify(token, process.env.JWT_VERIFICATION_TOKEN!);
    if (!verifyToken) throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
    const payload = verifyToken as jwt.JwtPayload;
    const user = await this.authRepository.getUser(Number(payload.id));
    if (!user) throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);

    await this.authRepository.verifyEmail(Number(payload.id), true);
    return { message: "User verified successfully" };
  };

  googleLogin = async (profile: Profile) => {
    let user = await this.authRepository.googleLogin(profile);
    if (!user) user = await this.authRepository.googleRegister(profile);
    const { accessToken, refreshToken } = generateTokens(user.id);
    return { user, accessToken, refreshToken };
  };

  changeFirstNameAndLastName = async (
    userId: number,
    firstName: string,
    lastName: string,
  ) => {
    const user = await this.authRepository.getUser(userId);
    if (!user) throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
    return await this.authRepository.changeFirstNameAndLastName(
      userId,
      firstName,
      lastName,
    );
  };

  changePassword = async (userId: number, password: string) => {
    const user = await this.authRepository.getUser(userId);
    if (!user) throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
    const password_hash = await argon2.hash(password);
    return await this.authRepository.changePassword(userId, password_hash);
  };

  deleteAccount = async (userId: number) => {
    const user = await this.authRepository.getUser(userId);
    if (!user) throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
    return await this.authRepository.deleteAccount(userId);
  };

  uploadAvatar = async (userId: number, buffer: Buffer) => {
    const user = await this.authRepository.getUser(userId);
    if (!user) throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
    const avatarUrl = await uploadImage(buffer);
    return await this.authRepository.uploadAvatar(userId, avatarUrl);
  };
}

export default AuthenticationServices;
