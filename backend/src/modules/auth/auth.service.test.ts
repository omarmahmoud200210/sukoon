import { vi, describe, it, expect, beforeEach } from "vitest";
import prisma from "../../shared/database/prisma";
import argon2 from "argon2";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AuthenticationServices from "./auth.service";
import AuthenticationRepo from "./auth.repositorty";
import { UserRole } from "../../shared/constants/enums";
import type { User } from "@prisma/client";
import sendEmail from "../../shared/utils/email.utils.ts";
import uploadImage from "../../shared/utils/upload.utils.ts";
import {
  generateVerificationToken,
  generateTokens,
} from "../../shared/utils/token.utils.js";

vi.mock("../../shared/database/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("jsonwebtoken", () => {
  const mockJwtPayload: JwtPayload = { id: 1 };
  return {
    default: {
      verify: vi.fn(() => mockJwtPayload),
    },
  };
});

vi.mock("argon2", () => ({
  default: {
    verify: vi.fn(() => Promise.resolve(true)),
    hash: vi.fn(() => Promise.resolve("hashed-password")),
  },
}));

vi.mock("../../shared/utils/token.utils.ts", () => ({
  generateVerificationToken: vi.fn(() => "mocked-verification-token"),
  generateAccessToken: vi.fn(() => "mocked-access-token"),
  generateRefreshToken: vi.fn(() => "mocked-refresh-token"),
  generateTokens: vi.fn(() => ({
    accessToken: "mocked-access-token",
    refreshToken: "mocked-refresh-token",
  })),
  generateForgotPasswordToken: vi.fn(() => "mocked-forgot-password-token"),
}));

vi.mock("../../shared/utils/email.utils.ts", () => ({
  default: vi.fn(() => Promise.resolve({ success: true })),
}));

vi.mock("../../shared/utils/upload.utils.ts", () => ({
  default: vi.fn(() => Promise.resolve("https://example.com/avatar.jpg")),
}));

const mockUser = {
  id: 1,
  email: "test@example.com",
  passwordHashed: "hashed-password",
  firstName: "John",
  lastName: "Doe",
  avatarUrl: null,
  isVerified: false,
  isActive: true,
  createdAt: new Date(),
  oauth: false,
  role: UserRole.USER,
};

describe("Authentication Service", () => {
  describe("Login", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("Login Happy Path", () => {
      it("should successfully log in a verified user and return tokens", async () => {
        vi.spyOn(authRepo, "login").mockResolvedValue({
          ...mockUser,
          isVerified: true,
        } as User);

        const result = await authService.login(
          "test@example.com",
          "password12345",
        );

        expect(result).toEqual({
          tokens: {
            accessToken: "mocked-access-token",
            refreshToken: "mocked-refresh-token",
          },
          status: true,
          user: {
            id: mockUser.id,
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            avatarUrl: null,
            isVerified: true,
          },
        });
        expect(argon2.verify).toHaveBeenCalledWith(
          "hashed-password",
          "password12345",
        );

        expect(generateTokens).toHaveBeenCalledWith(mockUser.id);
      });

      it("should return status false when user is not verified", async () => {
        vi.spyOn(authRepo, "login").mockResolvedValue({
          ...mockUser,
          isVerified: false,
        } as User);

        const result = await authService.login(
          "test@example.com",
          "password12345",
        );

        expect(result).toEqual({
          status: false,
          message: "Email is not verified",
        });
      });
    });

    describe("Login Unhappy Path", () => {
      it("should throw an error when the user does not exist", async () => {
        vi.spyOn(authRepo, "login").mockResolvedValue(null);
        await expect(
          authService.login("test@example.com", "password12345"),
        ).rejects.toThrow("The User Not Exist");
      });

      it("should throw an error if the database is down", async () => {
        vi.spyOn(authRepo, "login").mockRejectedValue(
          new Error("Database error"),
        );
        await expect(
          authService.login("test@example.com", "password12345"),
        ).rejects.toThrow("Database error");
      });

      it("Should throw an error for invalid credentials", async () => {
        vi.spyOn(authRepo, "login").mockResolvedValue({
          ...mockUser,
          isVerified: true,
        } as User);

        vi.mocked(argon2.verify).mockResolvedValue(false);

        await expect(
          authService.login("test@example.com", "password12345"),
        ).rejects.toThrow("Invalid password");
      });
    });
  });

  describe("Register", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
      vi.spyOn(authRepo, "register").mockResolvedValue({
        ...mockUser,
      } as User);
      vi.spyOn(authRepo, "getUser").mockResolvedValue(null);
    });

    const mockedUser = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: "password12345",
    };
    describe("Registration Happy Path", () => {
      it("should successfully register a new user with valid data", async () => {
        const result = await authService.register({
          ...mockedUser,
          password: "password12345",
        });

        expect(result).toEqual({
          email: mockedUser.email,
          message: "User is Registered but still not verified!!",
        });

        expect(authRepo.getUser).toHaveBeenCalledWith(
          undefined,
          mockedUser.email,
        );
        expect(argon2.hash).toHaveBeenCalledWith("password12345");
        expect(authRepo.register).toHaveBeenCalledWith(
          {
            email: mockedUser.email,
            firstName: mockedUser.firstName,
            lastName: mockedUser.lastName,
          },
          "hashed-password",
        );
      });

      it("should verify that a verification email is sent after registration", async () => {
        await authService.register({
          ...mockedUser,
          password: "password12345",
        });
        expect(sendEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            to: mockedUser.email,
            subject: "Verify Email",
            text: expect.stringContaining("mocked-verification-token"),
            html: expect.stringContaining("mocked-verification-token"),
          }),
        );
      });

      it("should check the generation of the verification token and its inclusion in the email content", async () => {
        await authService.register({
          ...mockedUser,
          password: "password12345",
        });
        expect(generateVerificationToken).toHaveBeenCalledWith(mockUser.id);
      });
    });

    describe("Registration Unhappy Path", () => {
      it("should throw an error when trying to register with an email that already exists", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);

        await expect(
          authService.register({
            firstName: "John",
            lastName: "Doe",
            email: "test@example.com",
            password: "password12345",
          }),
        ).rejects.toThrow("USER_ALREADY_EXISTS");
      });

      it("should throw an error when the password hashing process fails", async () => {
        vi.mocked(argon2.hash).mockRejectedValue(new Error("Hashing failed"));

        await expect(
          authService.register({
            ...mockedUser,
            password: "password12345",
          }),
        ).rejects.toThrow("Hashing failed");
      });

      it("Should throw an error of the generation of the verification token failed", async () => {
        vi.mocked(generateVerificationToken).mockImplementation(() => {
          throw new Error("Token generation failed");
        });

        await expect(
          authService.register({
            ...mockedUser,
            password: "password12345",
          }),
        ).rejects.toThrow("Token generation failed");
      });

      it("Should throw an error if the Database broken", async () => {
        vi.spyOn(authRepo, "register").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(
          authRepo.register(
            {
              email: mockedUser.email,
              firstName: mockedUser.firstName,
              lastName: mockedUser.lastName,
            },
            "hashed-password",
          ),
        ).rejects.toThrow("Database error");
      });
    });
  });

  describe("GetUser", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("GetUser Happy Path", () => {
      it("should successfully retrieve a user when user exists", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);

        const result = await authService.getUser(mockUser.id);

        expect(result).toEqual({
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          avatarUrl: mockUser.avatarUrl,
          isVerified: mockUser.isVerified,
          oauth: mockUser.oauth,
          role: mockUser.role,
        });

        expect(authRepo.getUser).toHaveBeenCalledWith(mockUser.id);
      });
    });

    describe("GetUser Unhappy Path", () => {
      it("should throw an Unauthorized error when user does not exist", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue(null);

        await expect(authService.getUser(999)).rejects.toThrow(
          "User not found",
        );
      });

      it("should throw an error if the database connection fails", async () => {
        vi.spyOn(authRepo, "getUser").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(authService.getUser(mockUser.id)).rejects.toThrow(
          "Database error",
        );
      });
    });
  });

  describe("ChangeFirstNameAndLastName", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("ChangeFirstNameAndLastName Happy Path", () => {
      it("should successfully update user's first and last name", async () => {
        const updatedUser = {
          ...mockUser,
          firstName: "Jane",
          lastName: "Smith",
        };
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "changeFirstNameAndLastName").mockResolvedValue(
          updatedUser as User,
        );

        const result = await authService.changeFirstNameAndLastName(
          mockUser.id,
          "Jane",
          "Smith",
        );

        expect(result).toEqual(updatedUser);
        expect(authRepo.getUser).toHaveBeenCalledWith(mockUser.id);
        expect(authRepo.changeFirstNameAndLastName).toHaveBeenCalledWith(
          mockUser.id,
          "Jane",
          "Smith",
        );
      });
    });

    describe("ChangeFirstNameAndLastName Unhappy Path", () => {
      it("should throw an Unauthorized error when user does not exist", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue(null);

        await expect(
          authService.changeFirstNameAndLastName(999, "Jane", "Smith"),
        ).rejects.toThrow("USER_NOT_FOUND");
      });

      it("should throw an error if the database connection fails during update", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "changeFirstNameAndLastName").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(
          authService.changeFirstNameAndLastName(mockUser.id, "Jane", "Smith"),
        ).rejects.toThrow("Database error");
      });
    });
  });

  describe("ChangePassword", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("ChangePassword Happy Path", () => {
      it("should successfully update user's password", async () => {
        const updatedUser = {
          ...mockUser,
          passwordHashed: "new-hashed-password",
        };
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "changePassword").mockResolvedValue(
          updatedUser as User,
        );

        const result = await authService.changePassword(
          mockUser.id,
          "newPassword123",
        );

        expect(result).toEqual(updatedUser);
        expect(authRepo.getUser).toHaveBeenCalledWith(mockUser.id);
        expect(argon2.hash).toHaveBeenCalledWith("newPassword123");
        expect(authRepo.changePassword).toHaveBeenCalledWith(
          mockUser.id,
          "hashed-password",
        );
      });
    });

    describe("ChangePassword Unhappy Path", () => {
      it("should throw an Unauthorized error when user does not exist", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue(null);

        await expect(
          authService.changePassword(999, "newPassword123"),
        ).rejects.toThrow("USER_NOT_FOUND");
      });

      it("should throw an error if password hashing fails", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.mocked(argon2.hash).mockRejectedValue(new Error("Hashing failed"));

        await expect(
          authService.changePassword(mockUser.id, "newPassword123"),
        ).rejects.toThrow("Hashing failed");
      });

      it("should throw an error if the database connection fails during password update", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "changePassword").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(
          authService.changePassword(mockUser.id, "newPassword123"),
        ).rejects.toThrow("Database error");
      });
    });
  });

  describe("DeleteAccount", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("DeleteAccount Happy Path", () => {
      it("should successfully delete user's account", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "deleteAccount").mockResolvedValue({
          ...mockUser,
        } as User);

        const result = await authService.deleteAccount(mockUser.id);

        expect(result).toEqual(mockUser);
        expect(authRepo.getUser).toHaveBeenCalledWith(mockUser.id);
        expect(authRepo.deleteAccount).toHaveBeenCalledWith(mockUser.id);
      });
    });

    describe("DeleteAccount Unhappy Path", () => {
      it("should throw an Unauthorized error when user does not exist", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue(null);

        await expect(authService.deleteAccount(999)).rejects.toThrow(
          "USER_NOT_FOUND",
        );
      });

      it("should throw an error if the database connection fails during deletion", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "deleteAccount").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(authService.deleteAccount(mockUser.id)).rejects.toThrow(
          "Database error",
        );
      });
    });
  });

  describe("ForgotPassword", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("ForgotPassword Happy Path", () => {
      it("should send password reset email when user exists and is verified", async () => {
        const verifiedUser = { ...mockUser, isVerified: true };
        vi.spyOn(authRepo, "getUser").mockResolvedValue(verifiedUser as User);

        const result = await authService.forgotPassword("test@example.com");

        expect(result).toEqual({ success: true });
        expect(authRepo.getUser).toHaveBeenCalledWith(
          undefined,
          "test@example.com",
        );
        expect(sendEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            to: "test@example.com",
            subject: "Reset Password",
          }),
        );
      });
    });

    describe("ForgotPassword Unhappy Path", () => {
      it("should return success when user does not exist (silent fail for security)", async () => {
        vi.spyOn(authRepo, "getUser").mockResolvedValue(null);

        const result = await authService.forgotPassword(
          "nonexistent@example.com",
        );

        expect(result).toEqual({ success: true });
        expect(sendEmail).not.toHaveBeenCalled();
      });

      it("should return success when user is not verified (silent fail for security)", async () => {
        const unverifiedUser = { ...mockUser, isVerified: false };
        vi.spyOn(authRepo, "getUser").mockResolvedValue(unverifiedUser as User);

        const result = await authService.forgotPassword("test@example.com");

        expect(result).toEqual({ success: true });
        expect(sendEmail).not.toHaveBeenCalled();
      });

      it("should throw an error if email sending fails", async () => {
        const verifiedUser = { ...mockUser, isVerified: true };
        vi.spyOn(authRepo, "getUser").mockResolvedValue(verifiedUser as User);
        vi.mocked(sendEmail).mockRejectedValue(
          new Error("Email service error"),
        );

        await expect(
          authService.forgotPassword("test@example.com"),
        ).rejects.toThrow("Email service error");
      });
    });
  });

  describe("ResetPassword", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("ResetPassword Happy Path", () => {
      it("should successfully reset password with valid token and existing user", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => ({
          id: mockUser.id,
        }));

        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "resetPassword").mockResolvedValue({
          isVerified: true,
        } as User);

        const result = await authService.resetPassword(
          "valid-reset-token",
          "newPassword123",
        );

        expect(result).toEqual({ success: true });
        expect(jwt.verify).toHaveBeenCalledWith(
          "valid-reset-token",
          process.env.JWT_FORGOT_PASSWORD_TOKEN,
        );
        expect(authRepo.getUser).toHaveBeenCalledWith(mockUser.id);
        expect(argon2.hash).toHaveBeenCalledWith("newPassword123");
        expect(authRepo.resetPassword).toHaveBeenCalledWith(
          mockUser.id,
          "hashed-password",
        );
      });
    });

    describe("ResetPassword Unhappy Path", () => {
      it("should throw an error when token is invalid", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => {
          throw new Error("Invalid token");
        });

        await expect(
          authService.resetPassword("invalid-token", "newPassword123"),
        ).rejects.toThrow("Invalid token");
      });

      it("should return success when user does not exist (silent fail for security)", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => ({ id: 999 }));
        vi.spyOn(authRepo, "getUser").mockResolvedValue(null);
        vi.spyOn(authRepo, "resetPassword").mockResolvedValue({
          isVerified: true,
        } as User);

        const result = await authService.resetPassword(
          "valid-token",
          "newPassword123",
        );

        expect(result).toEqual({ success: true });
        expect(authRepo.resetPassword).not.toHaveBeenCalled();
      });

      it("should throw an error if password hashing fails", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => ({
          id: mockUser.id,
        }));
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.mocked(argon2.hash).mockRejectedValue(new Error("Hashing failed"));

        await expect(
          authService.resetPassword("valid-token", "newPassword123"),
        ).rejects.toThrow("Hashing failed");
      });

      it("should throw an error if database fails during password reset", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => ({
          id: mockUser.id,
        }));
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "resetPassword").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(
          authService.resetPassword("valid-token", "newPassword123"),
        ).rejects.toThrow("Database error");
      });
    });
  });

  describe("VerifyEmail", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("VerifyEmail Happy Path", () => {
      it("should successfully verify email with valid token and existing user", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => ({
          id: mockUser.id,
        }));
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);

        vi.spyOn(authRepo, "verifyEmail").mockResolvedValue({
          ...mockUser,
          isVerified: true,
        } as User);

        const result = await authService.verifyEmail(
          "valid-verification-token",
        );

        expect(result).toEqual({ message: "User verified successfully" });
        expect(jwt.verify).toHaveBeenCalledWith(
          "valid-verification-token",
          process.env.JWT_VERIFICATION_TOKEN,
        );
        expect(authRepo.getUser).toHaveBeenCalledWith(mockUser.id);
        expect(authRepo.verifyEmail).toHaveBeenCalledWith(mockUser.id);
      });
    });

    describe("VerifyEmail Unhappy Path", () => {
      it("should throw an error when token is invalid", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => {
          throw new Error("Invalid token");
        });

        await expect(authService.verifyEmail("invalid-token")).rejects.toThrow(
          "Invalid token",
        );
      });

      it("should throw an Unauthorized error when user does not exist", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => ({ id: 999 }));
        vi.spyOn(authRepo, "getUser").mockResolvedValue(null);

        await expect(authService.verifyEmail("valid-token")).rejects.toThrow(
          "USER_NOT_FOUND",
        );
      });

      it("should throw an error if database fails during email verification", async () => {
        vi.mocked(jwt.verify).mockImplementation(() => ({
          id: mockUser.id,
        }));
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "verifyEmail").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(authService.verifyEmail("valid-token")).rejects.toThrow(
          "Database error",
        );
      });
    });
  });

  describe("GoogleLogin", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("GoogleLogin Happy Path", () => {
      it("should return user with tokens when user already exists", async () => {
        const googleProfile = {
          id: "google123",
          displayName: "John Doe",
          emails: [{ value: "john@google.com" }],
        } as any;

        vi.spyOn(authRepo, "googleLogin").mockResolvedValue({
          ...mockUser,
        } as User);

        vi.spyOn(authRepo, "googleRegister").mockResolvedValue({
          ...mockUser,
        } as User);

        const result = await authService.googleLogin(googleProfile);

        expect(result).toEqual({
          user: mockUser,
          accessToken: "mocked-access-token",
          refreshToken: "mocked-refresh-token",
        });
        expect(authRepo.googleLogin).toHaveBeenCalledWith(googleProfile);
        expect(authRepo.googleRegister).not.toHaveBeenCalled();
      });

      it("should create new user and return with tokens when user does not exist", async () => {
        const googleProfile = {
          id: "google456",
          displayName: "Jane Smith",
          emails: [{ value: "jane@google.com" }],
        } as any;

        vi.spyOn(authRepo, "googleLogin").mockResolvedValue(null);
        vi.spyOn(authRepo, "googleRegister").mockResolvedValue({
          ...mockUser,
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
        } as User);

        const result = await authService.googleLogin(googleProfile);

        expect(result).toEqual(
          expect.objectContaining({
            accessToken: "mocked-access-token",
            refreshToken: "mocked-refresh-token",
          }),
        );
        expect(authRepo.googleLogin).toHaveBeenCalledWith(googleProfile);
        expect(authRepo.googleRegister).toHaveBeenCalledWith(googleProfile);
      });
    });

    describe("GoogleLogin Unhappy Path", () => {
      it("should throw an error if googleLogin throws database error", async () => {
        const googleProfile = { id: "google789" } as unknown as any;
        vi.spyOn(authRepo, "googleLogin").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(authService.googleLogin(googleProfile)).rejects.toThrow(
          "Database error",
        );
      });

      it("should throw an error if googleRegister throws database error", async () => {
        const googleProfile = { id: "google999" } as any;
        vi.spyOn(authRepo, "googleLogin").mockResolvedValue(null);
        vi.spyOn(authRepo, "googleRegister").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(authService.googleLogin(googleProfile)).rejects.toThrow(
          "Database error",
        );
      });
    });
  });

  describe("UploadAvatar", () => {
    let authRepo: AuthenticationRepo;
    let authService: AuthenticationServices;

    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();

      authRepo = new AuthenticationRepo();
      authService = new AuthenticationServices(authRepo);
    });

    describe("UploadAvatar Happy Path", () => {
      it("should successfully upload avatar and return user with avatar URL", async () => {
        const buffer = Buffer.from("fake-image-data");
        const avatarUrl = "https://example.com/avatar.jpg";
        const updatedUser = { ...mockUser, avatarUrl };

        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "uploadAvatar").mockResolvedValue(
          updatedUser as User,
        );

        const result = await authService.uploadAvatar(mockUser.id, buffer);

        expect(result).toEqual(updatedUser);
        expect(authRepo.getUser).toHaveBeenCalledWith(mockUser.id);
        expect(authRepo.uploadAvatar).toHaveBeenCalledWith(
          mockUser.id,
          avatarUrl,
        );
      });
    });

    describe("UploadAvatar Unhappy Path", () => {
      it("should throw an Unauthorized error when user does not exist", async () => {
        const buffer = Buffer.from("fake-image-data");
        vi.spyOn(authRepo, "getUser").mockResolvedValue(null);

        await expect(authService.uploadAvatar(999, buffer)).rejects.toThrow(
          "USER_NOT_FOUND",
        );
      });

      it("should throw an error if image upload fails", async () => {
        const buffer = Buffer.from("fake-image-data");
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.mocked(uploadImage).mockRejectedValue(
          new Error("Upload service error"),
        );

        await expect(
          authService.uploadAvatar(mockUser.id, buffer),
        ).rejects.toThrow("Upload service error");
      });

      it("should throw an error if database fails during avatar update", async () => {
        const buffer = Buffer.from("fake-image-data");
        vi.spyOn(authRepo, "getUser").mockResolvedValue({
          ...mockUser,
        } as User);
        vi.spyOn(authRepo, "uploadAvatar").mockRejectedValue(
          new Error("Database error"),
        );

        await expect(
          authService.uploadAvatar(mockUser.id, buffer),
        ).rejects.toThrow("Database error");
      });
    });
  });
});
