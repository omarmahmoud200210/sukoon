import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import type { Multer } from "multer";
import jwt from "jsonwebtoken";

import AuthenticationController from "./auth.controller";
import AuthenticationServices from "./auth.service";
import { AppError } from "./../../shared/middleware/error";

// ─── Module-level mocks ───────────────────────────────────────────────────────
vi.mock("./../../shared/utils/cookies.utils", () => ({
  default: vi.fn(),
}));

vi.mock("./../../shared/utils/token.utils", () => ({
  generateAccessToken: vi.fn(),
}));

// ─── Import mocked modules (after vi.mock) ────────────────────────────────────
import setCookies from "./../../shared/utils/cookies.utils";
import { generateAccessToken } from "./../../shared/utils/token.utils";

// ─── Typed mock helpers ────────────────────────────────────────────────────────
const mockedSetCookies = vi.mocked(setCookies);
const mockedGenerateAccessToken = vi.mocked(generateAccessToken);

// ─── Factory helpers ───────────────────────────────────────────────────────────
function createMockRequest(overrides: Partial<Request> = {}): Partial<Request> {
  return {
    body: {},
    cookies: {},
    user: undefined,
    file: undefined,
    ...overrides,
  } as Partial<Request>;
}

function createMockResponse(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  res.redirect = vi.fn().mockReturnValue(res);
  res.sendStatus = vi.fn().mockReturnValue(res);
  return res;
}

// ─── Constants ──────────────────────────────────────────────────────────────────
const MOCK_ACCESS_TOKEN = "mock-access-token";
const MOCK_REFRESH_TOKEN = "mock-refresh-token";

// ─── Test Suite ─────────────────────────────────────────────────────────────────
describe("AuthenticationController", () => {
  let controller: AuthenticationController;
  let mockAuthServices: Partial<AuthenticationServices>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockAuthServices = {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      getUser: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      verifyEmail: vi.fn(),
      changeFirstNameAndLastName: vi.fn(),
      changePassword: vi.fn(),
      deleteAccount: vi.fn(),
      uploadAvatar: vi.fn(),
    } as Partial<AuthenticationServices>;

    controller = new AuthenticationController(
      mockAuthServices as AuthenticationServices,
    );

    req = createMockRequest();
    res = createMockResponse();
    next = vi.fn() as unknown as NextFunction;

    mockedGenerateAccessToken.mockReturnValue(MOCK_ACCESS_TOKEN);
  });

  describe("login", () => {
    const loginHandler = () =>
      controller.login(req as Request, res as Response, next as NextFunction);

    it("should return 200, set cookies, and return user JSON on successful login", async () => {
      req.body = {
        email: "test@example.com",
        password: "Password123!",
        rememberMe: true,
      };
      const serviceResult = {
        status: true,
        tokens: {
          accessToken: MOCK_ACCESS_TOKEN,
          refreshToken: MOCK_REFRESH_TOKEN,
        },
        user: { id: "user-id-1", email: "test@example.com" },
      };
      (mockAuthServices.login as ReturnType<typeof vi.fn>).mockResolvedValue(
        serviceResult,
      );

      await loginHandler();

      expect(mockAuthServices.login).toHaveBeenCalledWith(
        "test@example.com",
        "Password123!",
      );
      expect(mockedSetCookies).toHaveBeenCalledWith(
        res,
        MOCK_ACCESS_TOKEN,
        MOCK_REFRESH_TOKEN,
        true,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult.user);
    });

    it("should throw AppError on invalid credentials", async () => {
      req.body = { email: "test@example.com", password: "Password123!" };
      const serviceResult = { status: false };
      (mockAuthServices.login as ReturnType<typeof vi.fn>).mockResolvedValue(
        serviceResult,
      );

      await expect(loginHandler()).rejects.toThrow(AppError);
      await expect(loginHandler()).rejects.toMatchObject({
        message: "INVALID_CREDENTIALS",
      });
    });
  });

  describe("getUserData", () => {
    const getUserDataHandler = () =>
      controller.getUserData(req as Request, res as Response, next);

    it("should return 200 with user data when req.user exists", async () => {
      req.user = { id: 1 } as any;
      const serviceResult = { id: 1, email: "test@example.com" };
      (mockAuthServices.getUser as ReturnType<typeof vi.fn>).mockResolvedValue(
        serviceResult,
      );

      await getUserDataHandler();

      expect(mockAuthServices.getUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });
  });

  describe("register", () => {
    const registerHandler = () =>
      controller.register(req as Request, res as Response, next);

    it("should return 200 and registration data on successful registration", async () => {
      req.body = {
        email: "new@example.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
      };
      const serviceResult = { id: "user-id-2", email: "new@example.com" };
      (mockAuthServices.register as ReturnType<typeof vi.fn>).mockResolvedValue(
        serviceResult,
      );

      await registerHandler();

      expect(mockAuthServices.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    it("should throw INVALID_CREDENTIALS when service returns null", async () => {
      req.body = { email: "existing@example.com" };
      (mockAuthServices.register as ReturnType<typeof vi.fn>).mockResolvedValue(
        null,
      );

      await expect(registerHandler()).rejects.toMatchObject({
        message: "INVALID_CREDENTIALS",
      });
    });
  });

  describe("logout", () => {
    const logoutHandler = () =>
      controller.logout(req as Request, res as Response, next);

    it("should clear both cookies and return 200 with success message", async () => {
      await logoutHandler();

      expect(res.clearCookie).toHaveBeenCalledWith("access_token");
      expect(res.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logged out successfully",
      });
    });
  });

  describe("refreshToken", () => {
    const refreshTokenHandler = () =>
      controller.refreshToken(req as Request, res as Response, next);

    it("should return 200 and set new access_token cookie when refresh_token is valid", async () => {
      req.cookies = { refresh_token: MOCK_REFRESH_TOKEN };
      const decodedPayload = { id: 1 };
      vi.spyOn(jwt, "verify").mockReturnValue(decodedPayload as any);

      await refreshTokenHandler();

      expect(jwt.verify).toHaveBeenCalledWith(
        MOCK_REFRESH_TOKEN,
        process.env.JWT_REFRESH_TOKEN!,
      );
      expect(mockedGenerateAccessToken).toHaveBeenCalledWith(1);
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        MOCK_ACCESS_TOKEN,
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should throw TOKEN_INVALID when no refresh_token in cookies", async () => {
      req.cookies = {};
      await expect(refreshTokenHandler()).rejects.toMatchObject({
        message: "TOKEN_INVALID",
      });
    });

    it("should throw TOKEN_INVALID when refresh_token is invalid or expired", async () => {
      req.cookies = { refresh_token: "invalid-token" };
      vi.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("invalid token");
      });

      await expect(refreshTokenHandler()).rejects.toMatchObject({
        message: "TOKEN_INVALID",
      });
    });
  });

  describe("forgotPassword", () => {
    const forgotPasswordHandler = () =>
      controller.forgotPassword(req as Request, res as Response, next);

    it("should return 200 with success message when service succeeds", async () => {
      req.body = { email: "test@example.com" };
      const serviceResult = { message: "Reset email sent" };
      (
        mockAuthServices.forgotPassword as ReturnType<typeof vi.fn>
      ).mockResolvedValue(serviceResult);

      await forgotPasswordHandler();

      expect(mockAuthServices.forgotPassword).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    it("should throw error when service fails", async () => {
      req.body = { email: "nonexistent@example.com" };
      (
        mockAuthServices.forgotPassword as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      await expect(forgotPasswordHandler()).rejects.toMatchObject({
        message: "USER_NOT_FOUND",
      });
    });
  });

  describe("resetPassword", () => {
    const resetPasswordHandler = () =>
      controller.resetPassword(req as Request, res as Response, next);

    it("should return 200 with success message when service succeeds", async () => {
      req.body = { token: "reset-token-123", password: "NewPassword123!" };
      const serviceResult = { message: "Password reset successfully" };
      (
        mockAuthServices.resetPassword as ReturnType<typeof vi.fn>
      ).mockResolvedValue(serviceResult);

      await resetPasswordHandler();

      expect(mockAuthServices.resetPassword).toHaveBeenCalledWith(
        "reset-token-123",
        "NewPassword123!",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    it("should throw TOKEN_INVALID when service fails", async () => {
      req.body = { token: "invalid-token", password: "NewPassword123!" };
      (
        mockAuthServices.resetPassword as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      await expect(resetPasswordHandler()).rejects.toMatchObject({
        message: "TOKEN_INVALID",
      });
    });
  });

  describe("verifyEmail", () => {
    const verifyEmailHandler = () =>
      controller.verifyEmail(req as Request, res as Response, next);

    it("should return 200 with success message when service succeeds", async () => {
      req.body = { token: "verify-token-123" };
      const serviceResult = { message: "Email verified successfully" };
      (
        mockAuthServices.verifyEmail as ReturnType<typeof vi.fn>
      ).mockResolvedValue(serviceResult);

      await verifyEmailHandler();

      expect(mockAuthServices.verifyEmail).toHaveBeenCalledWith(
        "verify-token-123",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    it("should throw TOKEN_INVALID when service fails", async () => {
      req.body = { token: "invalid-token" };
      (
        mockAuthServices.verifyEmail as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      await expect(verifyEmailHandler()).rejects.toMatchObject({
        message: "TOKEN_INVALID",
      });
    });
  });

  describe("googleLogin", () => {
    const googleLoginHandler = () =>
      controller.googleLogin(req as Request, res as Response, next);

    it("should set cookies and redirect to frontend dashboard on OAuth success", async () => {
      req.user = {
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
      } as any;

      await googleLoginHandler();

      expect(mockedSetCookies).toHaveBeenCalledWith(
        res,
        MOCK_ACCESS_TOKEN,
        MOCK_REFRESH_TOKEN,
      );
      expect(res.redirect).toHaveBeenCalledWith(
        `${process.env.FRONTEND_URL}/dashboard`,
      );
    });

    it("should throw INVALID_CREDENTIALS when tokens are missing in req.user", async () => {
      req.user = {} as any;

      await expect(googleLoginHandler()).rejects.toMatchObject({
        message: "INVALID_CREDENTIALS",
      });
    });
  });

  describe("changeFirstNameAndLastName", () => {
    const changeNameHandler = () =>
      controller.changeFirstNameAndLastName(
        req as Request,
        res as Response,
        next,
      );

    it("should return 200 with updated user data", async () => {
      req.user = { id: 1 } as any;
      req.body = { firstName: "Jane", lastName: "Smith" };
      const serviceResult = { id: 1, firstName: "Jane", lastName: "Smith" };
      (
        mockAuthServices.changeFirstNameAndLastName as ReturnType<typeof vi.fn>
      ).mockResolvedValue(serviceResult);

      await changeNameHandler();

      expect(mockAuthServices.changeFirstNameAndLastName).toHaveBeenCalledWith(
        1,
        "Jane",
        "Smith",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    it("should throw USER_NOT_FOUND when service fails", async () => {
      req.user = { id: 1 } as any;
      req.body = { firstName: "Jane", lastName: "Smith" };
      (
        mockAuthServices.changeFirstNameAndLastName as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      await expect(changeNameHandler()).rejects.toMatchObject({
        message: "USER_NOT_FOUND",
      });
    });
  });

  describe("changePassword", () => {
    const changePasswordHandler = () =>
      controller.changePassword(req as Request, res as Response, next);

    it("should return 200 with updated user data", async () => {
      req.user = { id: 1 } as any;
      req.body = { password: "NewPassword123!" };
      const serviceResult = { id: 1, email: "test@example.com" };
      (
        mockAuthServices.changePassword as ReturnType<typeof vi.fn>
      ).mockResolvedValue(serviceResult);

      await changePasswordHandler();

      expect(mockAuthServices.changePassword).toHaveBeenCalledWith(
        1,
        "NewPassword123!",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    it("should throw USER_NOT_FOUND when service fails", async () => {
      req.user = { id: 1 } as any;
      req.body = { password: "NewPassword123!" };
      (
        mockAuthServices.changePassword as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      await expect(changePasswordHandler()).rejects.toMatchObject({
        message: "USER_NOT_FOUND",
      });
    });
  });

  describe("deleteAccount", () => {
    const deleteAccountHandler = () =>
      controller.deleteAccount(req as Request, res as Response, next);

    it("should return 200 with deletion result", async () => {
      req.user = { id: 1 } as any;
      const serviceResult = { message: "Account deleted successfully" };
      (
        mockAuthServices.deleteAccount as ReturnType<typeof vi.fn>
      ).mockResolvedValue(serviceResult);

      await deleteAccountHandler();

      expect(mockAuthServices.deleteAccount).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    it("should throw USER_NOT_FOUND when service fails", async () => {
      req.user = { id: 1 } as any;
      (
        mockAuthServices.deleteAccount as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      await expect(deleteAccountHandler()).rejects.toMatchObject({
        message: "USER_NOT_FOUND",
      });
    });
  });

  describe("uploadAvatar", () => {
    const uploadAvatarHandler = () =>
      controller.uploadAvatar(req as Request, res as Response, next);

    it("should return 200 with avatar data when file is uploaded", async () => {
      req.user = { id: 1 } as any;
      req.file = {
        buffer: Buffer.from("fake-image-data"),
      } as Partial<Multer.File>;
      const serviceResult = {
        id: 1,
        avatar: "https://cdn.example.com/avatar.png",
      };
      (
        mockAuthServices.uploadAvatar as ReturnType<typeof vi.fn>
      ).mockResolvedValue(serviceResult);

      await uploadAvatarHandler();

      expect(mockAuthServices.uploadAvatar).toHaveBeenCalledWith(
        1,
        Buffer.from("fake-image-data"),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceResult);
    });

    it("should throw BadRequest when no file is provided in req.file", async () => {
      req.user = { id: 1 } as any;
      req.file = undefined;

      await expect(uploadAvatarHandler()).rejects.toThrow(AppError);
    });

    it("should throw USER_NOT_FOUND when service fails", async () => {
      req.user = { id: 1 } as any;
      req.file = {
        buffer: Buffer.from("fake-image-data"),
      } as Partial<Multer.File>;
      (
        mockAuthServices.uploadAvatar as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      await expect(uploadAvatarHandler()).rejects.toMatchObject({
        message: "USER_NOT_FOUND",
      });
    });
  });
});
