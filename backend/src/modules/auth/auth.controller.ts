import type { RequestHandler } from "express";
import AuthenticationServices from "./auth.service.js";
import setCookies from "../../shared/utils/cookies.utils.js";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../shared/utils/token.utils.js";
import { AppError } from "../../shared/middleware/error.js";
import { AuthErrorCode } from "../../shared/constants/enums.js";

class AuthenticationController {
  constructor(private authServices: AuthenticationServices) {}

  login: RequestHandler = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const userLogin = await this.authServices.login(
      email,
      password,
    );

    if (userLogin.status) {
      setCookies(res, userLogin.tokens?.accessToken!, userLogin.tokens?.refreshToken!, rememberMe);
      return res.status(200).json(userLogin.user);
    }

    throw AppError.Unauthorized(AuthErrorCode.INVALID_CREDENTIALS);
  };

  getUserData: RequestHandler = async (req, res) => {
    const user = await this.authServices.getUser(req.user!.id);
    return res.status(200).json(user);
  };

  register: RequestHandler = async (req, res) => {
    const userData = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }
    
    const data = await this.authServices.register(userData);

    if (data) return res.status(200).json(data);
    throw AppError.Unauthorized(AuthErrorCode.INVALID_CREDENTIALS);
  };

  logout: RequestHandler = (_req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Logged out successfully" });
  };

  refreshToken: RequestHandler = async (req, res) => {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
    }

    try {
      const payload = jwt.verify(
        refresh_token,
        process.env.JWT_REFRESH_TOKEN!,
      ) as { id: number };
      const newAccessToken = generateAccessToken(payload.id);

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });

      return res.sendStatus(200);
    } catch {
      throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
    }
  };

  forgotPassword: RequestHandler = async (req, res) => {
    const { email } = req.body;
    const msg = await this.authServices.forgotPassword(email);

    if (msg) return res.status(200).json(msg);
    throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
  };

  resetPassword: RequestHandler = async (req, res) => {
    const { password, token } = req.body;
    const message = await this.authServices.resetPassword(token, password);

    if (message) return res.status(200).json(message);
    throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
  };

  verifyEmail: RequestHandler = async (req, res) => {
    const { token } = req.body;
    const message = await this.authServices.verifyEmail(token);

    if (message) return res.status(200).json(message);
    throw AppError.Unauthorized(AuthErrorCode.TOKEN_INVALID);
  };

  googleLogin: RequestHandler = async (req, res) => {
    const { accessToken, refreshToken } = req.user as any;

    if (accessToken && refreshToken) {
      setCookies(res, accessToken, refreshToken);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }

    throw AppError.Unauthorized(AuthErrorCode.INVALID_CREDENTIALS);
  };

  changeFirstNameAndLastName: RequestHandler = async (req, res) => {
    const { firstName, lastName } = req.body;
    const message = await this.authServices.changeFirstNameAndLastName(req.user!.id, firstName, lastName);
    if (message) return res.status(200).json(message);
    throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
  }

  changePassword: RequestHandler = async (req, res) => {
    const { password } = req.body;
    const message = await this.authServices.changePassword(req.user!.id, password);
    if (message) return res.status(200).json(message);
    throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
  }

  deleteAccount: RequestHandler = async (req, res) => {
    const message = await this.authServices.deleteAccount(req.user!.id);
    if (message) return res.status(200).json(message);
    throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
  }

  uploadAvatar: RequestHandler = async (req, res) => {
    const file = req.file;
    if (!file) throw AppError.BadRequest("No file uploaded");
    const message = await this.authServices.uploadAvatar(req.user!.id, file.buffer);
    if (message) return res.status(200).json(message);
    throw AppError.Unauthorized(AuthErrorCode.USER_NOT_FOUND);
  }
}

export default AuthenticationController;
